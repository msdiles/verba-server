import express from "express"
import { Request, Response } from "express"
import AuthControllerApi from "../controllers/auth.controller.api"
import Validator from "../utils/validator"
class AuthRouter {
  public path = "/auth"
  public router = express.Router()
  public middleWares
  constructor(middleWares: any = []) {
    this.middleWares = middleWares
    this.initRoute()
  }

  private initRoute() {

    this.router.post(
      "/email-check",
      Validator.emailRules(),
      Validator.validate,
      AuthControllerApi.checkEmail
    )
    this.router.post(
      "/signup",
      Validator.signupRules(),
      Validator.validate,
      AuthControllerApi.signUp
    )
    this.router.post(
      "/signin",
      Validator.signinRules(),
      Validator.validate,
      AuthControllerApi.signIn
    )
    this.router.post(
      "/logout",
      Validator.logoutRules(),
      Validator.validate,
      AuthControllerApi.logOut
    )

    this.router.post(
      "/refresh",
      Validator.refreshRules(),
      Validator.validate,
      AuthControllerApi.refreshTokens
    )

    this.router.get(
      "/refresh",
      AuthControllerApi.checkJWTMiddleware,
      AuthControllerApi.getUserInfo
    )

    this.router.post(
      "/reset/get",
      Validator.emailRules(),
      Validator.validate,
      AuthControllerApi.getResetURL
    )

    this.router.post(
      "/reset/check",
      Validator.resetCheckRules(),
      Validator.validate,
      AuthControllerApi.resetCheck
    )

    this.router.post(
      "/reset/password",
      Validator.resetPasswordRules(),
      Validator.validate,
      AuthControllerApi.resetPassword
    )
  }
}

export default AuthRouter
