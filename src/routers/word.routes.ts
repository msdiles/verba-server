import express from "express"
import {Request, Response} from "express"
import Validator from "../utils/validator";
import WordControllerApi from "../controllers/word.controller.api";

class WordRouter {
    public path = "/words"
    public router = express.Router()
    public middleWares

    constructor(middleWares: any = []) {
        this.middleWares = middleWares
        this.initRoute()
    }

    private initRoute() {
        this.router.post(
            "/add",
            Validator.wordCreateRules(),
            Validator.validate,
            WordControllerApi.addWord)
        this.router.get(
            "/search",
            WordControllerApi.searchWords)
        this.router.get(
            "/find",
            WordControllerApi.findWord)
        this.router.put(
            "/update",
            Validator.wordUpdateRules(),
            Validator.validate,
            WordControllerApi.updateWord)
        this.router.delete(
            "/delete",
            Validator.wordDeleteRules(),
            Validator.validate,
            WordControllerApi.deleteWord)
    }
}

export default WordRouter
