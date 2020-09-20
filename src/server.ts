import App from "./app"
import express from "express"
import compression from "compression"
import helmet from "helmet"
import logger from "morgan"
import rateLimit from "express-rate-limit"
import AuthRouter from "./routers/auth.routes"
import WordRouter from "./routers/word.routes"

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
    express.urlencoded({ extended: true }),
  ],
  routers: [new AuthRouter([limiter]),new WordRouter()],
})

app.listen()
