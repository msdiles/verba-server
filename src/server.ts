import App from "./app"
import express from "express"
import compression from "compression"
import helmet from "helmet"
import logger from "morgan"
import cors from "cors"

import rateLimit from "express-rate-limit"
import AuthRouter from "./routers/auth.routes"
import WordRouter from "./routers/word.routes"
import QuoteRouter from "./routers/quote.routes"

import mongoConnect from "./utils/mongoConnect";

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
})

const app = new App({
    port: 3000,
    middleWares: [
        compression(),
        helmet(),
        logger("dev"),
        express.json(),
        express.urlencoded({extended: true}),
        cors()
    ],
    routers: [new AuthRouter([limiter]), new WordRouter(), new QuoteRouter()],
})

mongoConnect()
    .then(() => app.listen())
    .catch(e => console.log(e))

