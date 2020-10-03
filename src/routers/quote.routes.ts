import express from "express"
import Validator from "../utils/validator";
import QuoteControllerApi from "../controllers/quote.controller.api";
import AuthControllerApi from "../controllers/auth.controller.api";

class QuoteRouter {
    public path = "/quotes"
    public router = express.Router()
    public middleWares

    constructor(middleWares: any = []) {
        this.middleWares = middleWares
        this.initRoute()
    }

    private initRoute() {
        this.router.post(
            "/add",
            AuthControllerApi.checkJWTMiddleware,
            Validator.quoteCreateRules(),
            Validator.validate,
            QuoteControllerApi.addQuote)
        this.router.get(
            "/search",
            QuoteControllerApi.searchQuotes)
        this.router.get(
            "/find",
            QuoteControllerApi.findQuote)
        this.router.put(
            "/update",
            AuthControllerApi.checkJWTMiddleware,
            Validator.quoteUpdateRules(),
            Validator.validate,
            QuoteControllerApi.updateQuote)
        this.router.delete(
            "/delete",
            AuthControllerApi.checkJWTMiddleware,
            Validator.quoteDeleteRules(),
            Validator.validate,
            QuoteControllerApi.deleteQuote)
    }
}

export default QuoteRouter
