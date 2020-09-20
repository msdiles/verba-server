import express, { Application } from "express"
import { errorMiddleware } from "./utils/error.handler"

class App {
  public app: Application
  public port: number

  constructor(appInit: { port: number; middleWares: any; routers: any }) {
    this.app = express()
    this.port = appInit.port

    this.middlewares(appInit.middleWares)
    this.routers(appInit.routers)
    this.errorHandler()
  }

  private middlewares(middleWares: any[]) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare)
    })
  }

  private routers(routers: any[]) {
    routers.forEach((router) => {
      this.app.use(router.path, ...router.middleWares, router.router)
    })
  }

  private errorHandler() {
    this.app.use(errorMiddleware)
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(
        `⚡️[server]: Server is running at https://localhost:${this.port}`
      )
    })
  }
}

export default App
