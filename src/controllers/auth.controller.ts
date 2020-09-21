import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { QueryResult } from "pg"

import { HTTPException } from "./../utils/error.handler"
import pool from "../utils/sql.config"

import Email from "../utils/email.api"

export interface IUser {
  id: string
  name: string
  role: string[]
}

class AuthController {
  static async isUserExist(email: string): Promise<boolean> {
    try {
      const userData = await pool.query(
        "Select email from users where email =$1",
        [email]
      )
      return !!userData.rowCount
    } catch (e) {
      throw new HTTPException(500, "Database query error")
    }
  }

  static async registerUser(
    login: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      await pool.query(
        "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) ON CONFLICT ON CONSTRAINT email_is_uniq DO NOTHING",
        [login, email, password]
      )
      return
    } catch (e) {
      throw new HTTPException(
        500,
        "Something went wrong. User registration failed"
      )
    }
  }
  static async checkPassword(password: string, email: string) {
    try {
      const userData = await pool.query("SELECT * FROM users WHERE email =$1", [
        email,
      ])
      if (!userData.rowCount) {
        throw new HTTPException(401, "Invalid password or email")
      }
      const user = userData.rows[0]
      const [tokenData, success] = await Promise.all([
        this.getTokenPayload(userData),
        bcrypt.compare(password, user.password),
      ])
      return await { success, tokenData }
    } catch (e) {
      if (e instanceof HTTPException) {
        throw new HTTPException(e.status, e.message)
      } else throw new Error(e.message)
    }
  }
  static async createAccessToken(
    payload: IUser,
    time: string = "30s"
  ): Promise<string> {
    try {
      return await this.asyncSign(
        { user: payload },
        <string>process.env.ACCESS_SECRET_KEY,
        { expiresIn: time }
      )
    } catch (e) {
      throw new Error(e)
    }
  }
  static async createRefreshToken(
    payload: IUser,
    fingerprint: string
  ): Promise<string> {
    try {
      const countSessions = await pool.query(
        "SELECT count(*) FROM sessions WHERE user_id = $1",
        [payload.id]
      )
      if (countSessions.rows[0].count >= 5) {
        await pool.query("DELETE FROM sessions WHERE user_id = $1", [
          payload.id,
        ])
      }
      const token = await this.asyncSign(
        { user: payload },
        <string>process.env.REFRESH_SECRET_KEY,
        { expiresIn: "12m" }
      )
      await pool.query(
        "INSERT INTO sessions (refresh_token,fingerprint,user_id) VALUES ($1,$2,(SELECT user_id FROM users WHERE users.user_id =$3))",
        [token, fingerprint, payload.id]
      )
      return token
    } catch (e) {
      throw new Error(e)
    }
  }

  static async deleteSession(token: string): Promise<void> {
    try {
      await pool.query("DELETE FROM sessions where refresh_token=$1", [token])
    } catch (e) {
      throw new Error(e)
    }
  }

  static async asyncSign(
    { user }: { user: IUser },
    secret: string,
    { expiresIn }: { expiresIn: string }
  ): Promise<string> {
    try {
      return await jwt.sign({ user: user }, secret, { expiresIn })
    } catch (e) {
      throw new Error(e)
    }
  }

  static async asyncVerify(
    token: string,
    secret: string
  ): Promise<string | object> {
    try {
      return await jwt.verify(token, secret)
    } catch (e) {
      if (e.message === "jwt expired") {
        throw new HTTPException(401, "Token expired", e)
      } else {
        throw new HTTPException(401, "Invalid token", e)
      }
    }
  }

  static async getInfoAboutUserThroughToken(
    token: string
  ): Promise<QueryResult<any>> {
    try {
      const queryRes: QueryResult<any> = await pool.query(
        "SELECT * FROM users u JOIN sessions ON(u.user_id = sessions.user_id) WHERE sessions.refresh_token =$1",
        [token]
      )
      if (queryRes.rowCount === 0) {
        throw new HTTPException(403, "Not found token")
      }
      return await queryRes
    } catch (e) {
      if (e instanceof HTTPException) {
        throw new HTTPException(e.status, e.message)
      } else throw new Error(e.message)
    }
  }
  static async checkSessionIsValid(
    userData: QueryResult<any>,
    fingerprint: string
  ): Promise<boolean> {
    try {
      if (userData.rows[0].fingerprint === fingerprint) {
        return await true
      } else {
        throw new HTTPException(403, "Invalid fingerprint")
      }
    } catch (e) {
      if (e instanceof HTTPException) {
        throw new HTTPException(e.status, e.message)
      } else throw new Error(e.message)
    }
  }

  static async getTokenPayload(userData: QueryResult<any>): Promise<IUser> {
    try {
      const tokenData = {
        id: userData.rows[0].user_id,
        name: userData.rows[0].username,
        role: userData.rows[0].user_role.slice(1, -1).split(","),
      }
      return await tokenData
    } catch (e) {
      throw new Error(e)
    }
  }
  static async getInfoAboutUserThroughEmail(
    email: string
  ): Promise<QueryResult<any>> {
    try {
      const queryRes = await pool.query("SELECT * FROM users WHERE email=$1", [
        email,
      ])
      return queryRes
    } catch (e) {
      throw new Error(e)
    }
  }
  static async createResetPasswordURL(email: string): Promise<void> {
    try {
      const userData = await this.getInfoAboutUserThroughEmail(email)
      const payload = await this.getTokenPayload(userData)
      const resetToken = await this.createAccessToken(payload, "3m")
      await this.saveResetTokenToDatabase(payload.id, resetToken)
      const sender = new Email(resetToken, payload.id, email)
      sender.sendEmail(email, payload.id, resetToken)
    } catch (e) {}
  }
  static async saveResetTokenToDatabase(
    id: string,
    resetToken: string
  ): Promise<void> {
    try {
      await pool.query(
        "INSERT INTO resetTokens (user_id,reset_token) VALUES ($1,$2) ON CONFLICT (user_id) DO UPDATE SET reset_token = $2",
        [id, resetToken]
      )
    } catch (e) {
      throw new Error(e)
    }
  }
  static async checkResetToken(id: string, token: string): Promise<boolean> {
    try {
      const result = await pool.query(
        "SELECT reset_token FROM resetTokens WHERE user_id=$1",
        [id]
      )
      if (result.rows[0] && result.rows[0].reset_token === token) {
        return true
      }
      return false
    } catch (e) {
      throw new Error(e)
    }
  }
  static async changePassword(id: string, token: string, password: string) {
    try {
      await pool.query("UPDATE users SET password = $1 WHERE user_id =$2", [
        password,
        id,
      ])
      await pool.query("DELETE FROM resetTokens WHERE reset_token = $1", [
        token,
      ])
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default AuthController
