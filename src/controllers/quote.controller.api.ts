import Quote from "../models/quote"
import {NextFunction, Request, Response} from "express"
import pool from "../utils/sql.config"

interface IConditions {
    [key: string]: any
}

class QuoteControllerApi {
    static async addQuote(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const data = req.body.data
            const count = await Quote.countDocuments({})
            const url = count + "-" + data.url
            const date = Date.now()
            await Quote.create({...data, date, url})
            res.status(200).send({success: true, target: {...data, date, url}})
        } catch (e) {
            next(e)
        }
    }

    static async searchQuotes(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            let tag = req.query.tag as string
            let word = req.query.word as string
            let number = req.query.number
            let author = req.query.author as string
            let quote = req.query.quote as string
            let inspiration = req.query.inspiration
            let user = req.query.user as string
            let favorite = req.query.favorite
            let conditions: IConditions = {}
            if (tag) conditions.tags = new RegExp(`^${tag}$`, "i")
            if (word) conditions.words = new RegExp(`^${word}$`, "i")
            if (author) conditions.author = new RegExp(`^${author}$`, "i")
            if (quote) conditions.quote = new RegExp(quote, "i")
            if (inspiration) conditions.inspiration = inspiration
            if (favorite) conditions.favorite = new RegExp(`^${user}$`, "i")
            if (Object.keys(conditions).length > 0) {
                let words = await Quote.find({...conditions})
                if (words.length) {
                    if (number) words = words.slice(0, +number)
                    res.status(200).send({success: true, result: words})
                    return
                }
            } else if (number && +number > 0) {
                let words = await Quote.aggregate(
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

    static async findQuote(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const quote: string = req.query.quote as string
            const foundQuote = await Quote.findOne({url: quote}).lean()
            if (foundQuote) {
                const userInfo = await pool.query("SELECT (username) FROM users  WHERE user_id = $1",
                    [foundQuote.userId])
                if (userInfo.rows[0]) {
                    res.status(200).send({success: true, result: {...foundQuote, username: userInfo.rows[0].username}})
                }
            } else {

                res.status(200).send({success: false})
            }
        } catch (e) {
            next(e)
        }
    }

    static async updateQuote(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const data = req.body.data
            const isExist = await Quote.findOne({_id: data._id})
            if (isExist) {
                await Quote.findByIdAndUpdate({_id: data._id}, {...data})
                res.status(200).send({success: true, target: data})
            } else {
                res.status(200).send({success: false, target: data})
            }
        } catch (e) {
            next(e)
        }
    }

    static async deleteQuote(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = req.body.id
            await Quote.findByIdAndDelete({_id: id})
            res.status(200).send({success: true, target: id})
        } catch (e) {
            next(e)
        }
    }


}

export default QuoteControllerApi

