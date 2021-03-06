import {HTTPException} from "../utils/error.handler"
import {NextFunction, Request, Response} from "express"
import AuthController from "./auth.controller"
import bcrypt from "bcrypt"

const saltRounds = 10

class AuthControllerApi {
    static async checkEmail(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {email} = req.body
            const isUserExist = await AuthController.isUserExist(email)
            res.status(200).send({isUserExist, email})
        } catch (e) {
            next(e)
        }
    }

    static async signUp(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {email, login, password} = req.body

            const hashedPassword = await bcrypt.hash(password, saltRounds)
            const isUserExist = await AuthController.isUserExist(email)
            if (isUserExist) {
                res.status(200).send({
                    success: false,
                    message: "User with this email already exists",
                })
            }
            {
                await AuthController.registerUser(login, email, hashedPassword)
                res.status(200).send({success: true, message: "User registered"})
            }
        } catch (e) {
            next(e)
        }
    }

    static async signIn(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {email, password, fingerprint} = req.body
            const {success, tokenData} = await AuthController.checkPassword(
                password,
                email
            )
            if (!success) {
                throw new HTTPException(401, "Invalid password or email")
            }
            const [accessToken, refreshToken] = await Promise.all([
                AuthController.createAccessToken(tokenData),
                AuthController.createRefreshToken(tokenData, fingerprint),
            ])
            res.status(200).send({
                user: {...tokenData},
                accessToken: accessToken,
                refreshToken: refreshToken,
                success: true,
            })
        } catch (e) {
            next(e)
        }
    }

    static async logOut(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const token = req.body.token
            await AuthController.deleteSession(token)
            res.status(200).send({success: true})
        } catch (e) {
            next(e)
        }
    }

    static async getUserInfo(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            res.status(200).send(req.body.user)
        } catch (e) {
            next(e)
        }
    }

    static async checkJWTMiddleware(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const header = req.headers["authorization"]
            if (typeof header !== "undefined") {
                const bearer = header.split(" ")
                const token = bearer[1]

                if (token) {

                    req.body.user = await AuthController.asyncVerify(
                        token,
                        <string>process.env.ACCESS_SECRET_KEY
                    )
                    next()
                }
            } else {
                res.status(401).send({success: false, error: "Token is invalid"})
            }
        } catch (e) {
            next(e)
        }
    }

    static async refreshTokens(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {token, fingerprint} = req.body
            await AuthController.asyncVerify(
                token,
                <string>process.env.REFRESH_SECRET_KEY
            )
            const userData = await AuthController.getInfoAboutUserThroughToken(token)
            await AuthController.checkSessionIsValid(userData, fingerprint)
            const tokenData = await AuthController.getTokenPayload(userData)
            const [accessToken, refreshToken] = await Promise.all([
                AuthController.createAccessToken(tokenData),
                AuthController.createRefreshToken(tokenData, fingerprint),
            ])
            await AuthController.deleteSession(token)
            res.status(200).send({
                user: {...tokenData},
                accessToken: accessToken,
                refreshToken: refreshToken,
                success: true,
            })
        } catch (e) {
            try {
                await AuthController.deleteSession(req.body.token)
                next(e)
            } catch (e) {
                next(e)
            }
        }
    }

    static async getResetURL(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const email = req.body.email
            const isUserExist = await AuthController.isUserExist(email)
            res.status(202).send({isUserExist})
            if (isUserExist) {
                AuthController.createResetPasswordURL(email)
            }
        } catch (e) {
            next(e)
        }
    }

    static async resetCheck(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {resetId, resetDate} = req.body
            console.log(resetId, resetDate)

            const isToken = await AuthController.checkResetToken(resetId, resetDate)
            if (isToken) {
                res.status(200).send({success: true})
            } else {
                throw new HTTPException(403, "Token not found")
            }
        } catch (e) {
            next(e)
        }
    }

    static async resetPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {resetId, resetDate, password} = req.body

            const isToken = await AuthController.checkResetToken(resetId, resetDate)

            if (isToken) {
                const hashedPassword = await bcrypt.hash(password, saltRounds)
                await AuthController.changePassword(resetId, resetDate, hashedPassword)
                res.status(200).send({success: true})
            } else {
                throw new HTTPException(403, "Token not found")
            }
        } catch (e) {
            next(e)
        }
    }
}

export default AuthControllerApi
