import express from "express"
import { Request, Response } from "express"

class WordRouter {
  public path = "/words"
  public router = express.Router()
  public middleWares
  constructor(middleWares: any=[]) {
    this.middleWares = middleWares
    this.initRoute()
  }

  private initRoute() {}
}

export default WordRouter
