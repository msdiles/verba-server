import Word from "../models/word"
import {NextFunction, Request, Response} from "express"
import Quote from "../models/quote"
import pool from "../utils/sql.config"
import {IConditions} from "./quote.controller.api"


class WordControllerApi {
  static async addWord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body.data
      const isExist = await Word.countDocuments({word: data.word})
      if (isExist) {
        res.status(409).send({success: false})
      } else {
        const date = Date.now()
        await Word.create({...data, date})
        res.status(200).send({success: true})
      }
    } catch (e) {
      next(e)
    }
  }

  static async searchWords(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const random = req.query.random
      const word = req.query.word as string
      const number = req.query.number || 10
      let favorite = req.query.favorite || false
      let user = req.query.user as string
      const language = req.query.language as string
      let added = req.query.added as string
      let conditions: IConditions = {}
      if (word) conditions.word = new RegExp(`^${word}`, "i")
      if (language)
        conditions.language = new RegExp(`^${language.split(",").join("|")}$`, "i")
      if (favorite) conditions.favorite = new RegExp(`^${user}$`, "i")
      if(added){
        let words = await Word.find({userId:added})
        res.status(200).send({success: true, result: words})
        return
      }
      if (random) {
        let word = await Word.aggregate(
          [{$match: {"language": language || /.*/g}}, {$sample: {size: 1}}]
        )
        if (word.length) {
          const userInfo = await pool.query("SELECT (username) FROM users  WHERE user_id = $1",
            [word[0].userId])
          if (userInfo.rows[0]) {
            res.status(200).send({success: true, result: {...word[0], username: userInfo.rows[0].username}})
            return
          }
        }
      } else if (word || Object.keys(conditions).length>0) {
        let words = await Word.find({...conditions})
        if (words.length) {
          words = words.slice(0, +number)
          res.status(200).send({success: true, result: words})
          return
        }
      } else if (number && +number > 0) {
        let words = await Word.aggregate(
          [{$match: {"language": language || /.*/g}}, {$sample: {size: +number}}]
        )
        res.status(200).send({success: true, result: words})
        return
      }
      res.status(200).send({success: false})
      return
    } catch (e) {
      next(e)
    }
  }

  static async findWord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const word = req.query.word as string
      const words = await Word.find({word}).lean()
      if (words.length) {
        const userInfo = await pool.query("SELECT (username) FROM users  WHERE user_id = $1",
          [words[0].userId])
        if (userInfo.rows[0]) {
          res.status(200).send({success: true, result: {...words[0], username: userInfo.rows[0].username}})
          return
        }
      }
      res.status(200).send({success: false})

    } catch (e) {
      next(e)
    }
  }

  static async updateWord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body.data
      const isExist = await Word.findOne({_id: data._id})
      if (!isExist || (!!isExist && data._id == isExist._id)) {
        await Word.findByIdAndUpdate({_id: data._id}, {...data})
        res.status(200).send({success: true, target: data})
      } else {
        res.status(200).send({success: false, target: data})
      }
    } catch (e) {
      next(e)
    }
  }

  static async deleteWord(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.body.id
      await Word.findByIdAndDelete({_id: id})
      res.status(200).send({success: true, target: id})
    } catch (e) {
      next(e)
    }
  }
}

export default WordControllerApi
