import Word from "../models/word";
import {NextFunction, Request, Response} from "express";


class WordControllerApi {
    static async addWord(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {word, meanings} = req.body
            const isExist = await Word.countDocuments({word})
            if (isExist) {
                res.status(409).send({success: false})
            } else {
                await Word.create({word, meanings})
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
            const word = new RegExp("^" + <string>req.query.word, "i")
            const words = await Word.find({word})
            if (words.length) {
                const tenWords = words.slice(0, 10)
                res.status(200).send({success: true, result: tenWords})
            } else {
                res.status(200).send({success: false})
            }
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
            const word = req.query.word
            const words = await Word.find({word})
            if (words.length) {
                console.log(words)
                res.status(200).send({success: true, result: words[0]})
            } else {
                res.status(200).send({success: false})
            }
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
            const {id, word, meanings} = req.body
            const isExist = await Word.findOne({word: word})
            // @ts-ignore
            if (!isExist || (!!isExist && id == isExist._id)) {
                await Word.findByIdAndUpdate({_id: id}, {_id: id, word, meanings})
                res.status(200).send({success: true, target: id})
            } else {
                res.status(200).send({success: false, target: id})
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
