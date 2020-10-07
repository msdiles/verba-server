import Word from "../models/word"
import {NextFunction, Request, Response} from "express"
import Quote from "../models/quote"
import pool from "../utils/sql.config"


class WordControllerApi {
    static async addWord(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const data = req.body.data
            const isExist = await Word.countDocuments({word:data.word})
            if (isExist) {
                res.status(409).send({success: false})
            } else {
                const date = Date.now()
                await Word.create({...data,date})
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
            const word = req.query.word
            const number = req.query.number || 10
            if (word) {
                let words = await Word.find({word: new RegExp("^" + word, "i")})
                if (words.length) {
                    words = words.slice(0, +number)
                    res.status(200).send({success: true, result: words})
                    return
                }
            } else if (number && +number > 0) {
                let words = await Word.aggregate(
                    [{$sample: {size: +number}}]
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
                    res.status(200).send({success: true, result: {... words[0], username: userInfo.rows[0].username}})
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
