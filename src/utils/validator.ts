import {IErrors} from "./../interfaces"
import {HTTPException} from "./error.handler"
import {Response, Request, NextFunction} from "express"
import {check, validationResult} from "express-validator"

class Validator {
    static validate = (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validationResult(req)
            if (errors.isEmpty()) {
                return next()
            }

            const extractedErrors: IErrors[] = []
            errors
                .array()
                .map((err) => extractedErrors.push({[err.param]: err.msg}))
            throw new HTTPException(422, "Invalid format", extractedErrors)
        } catch (e) {
            next(e)
        }
    }

    static emailRules = () => {
        return [
            check("email")
                .not()
                .isEmpty()
                .withMessage("Email is empty")
                .isEmail()
                .withMessage("Email is invalid")
                .isLength({min: 5})
                .withMessage("Length less than 5 characters")
                .isLength({max: 128})
                .withMessage("Length more than 128 characters")
                .trim(),
        ]
    }

    static signupRules = () => {
        return [
            check("email")
                .not()
                .isEmpty()
                .withMessage("Email is empty")
                .isEmail()
                .withMessage("Email is invalid")
                .isLength({min: 5})
                .withMessage("Length less than 5 characters")
                .isLength({max: 128})
                .withMessage("Length more than 128 characters")
                .trim(),
            check("login")
                .not()
                .isEmpty()
                .withMessage("Login is empty")
                .isLength({min: 6, max: 128})
                .withMessage("Length less than 3 characters or more then 128")
                .trim(),
            check("password")
                .not()
                .isEmpty()
                .withMessage("Password is empty")
                .isLength({min: 8, max: 128})
                .withMessage("Length less than 6 characters or more then 128")
                .trim(),
        ]
    }

    static signinRules = () => {
        return [
            check("email")
                .not()
                .isEmpty()
                .withMessage("Email is empty")
                .isEmail()
                .withMessage("Email is invalid")
                .isLength({min: 5})
                .withMessage("Length less than 5 characters")
                .isLength({max: 128})
                .withMessage("Length more than 128 characters")
                .trim(),
            check("fingerprint")
                .not()
                .isEmpty()
                .withMessage("fingerprint is empty")
                .isLength({min: 6, max: 128})
                .withMessage("Length less than 3 characters or more then 128")
                .trim(),
            check("password")
                .not()
                .isEmpty()
                .withMessage("Password is empty")
                .isLength({min: 8, max: 128})
                .withMessage("Length less than 6 characters or more then 128")
                .trim(),
        ]
    }

    static logoutRules = () => {
        return [
            check("token")
                .not()
                .isEmpty()
                .withMessage("token is empty")
                .isLength({min: 6, max: 1280})
                .withMessage("Length less than 3 characters or more then 1280")
                .trim(),
        ]
    }

    static refreshRules = () => {
        return [
            check("token")
                .not()
                .isEmpty()
                .withMessage("token is empty")
                .isLength({min: 6, max: 1280})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
            check("fingerprint")
                .not()
                .isEmpty()
                .withMessage("fingerprint is empty")
                .isLength({min: 6, max: 1280})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
        ]
    }

    static resetCheckRules = () => {
        return [
            check("resetDate")
                .not()
                .isEmpty()
                .withMessage("resetDate is empty")
                .isLength({min: 6, max: 1280})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
            check("resetId")
                .not()
                .isEmpty()
                .withMessage("resetId is empty")
                .isLength({min: 6, max: 1280})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
        ]
    }

    static resetPasswordRules = () => {
        return [
            check("resetDate")
                .not()
                .isEmpty()
                .withMessage("resetDate is empty")
                .isLength({min: 6, max: 1280})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
            check("resetId")
                .not()
                .isEmpty()
                .withMessage("resetId is empty")
                .isLength({min: 6, max: 1280})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
            check("password")
                .not()
                .isEmpty()
                .withMessage("Password is empty")
                .isLength({min: 8, max: 128})
                .withMessage("Length less than 6 characters or more then 128")
                .trim(),
        ]
    }

    static wordCreateRules = () => {
        return [
            check("word")
                .not()
                .isEmpty()
                .withMessage("word is empty")
                .isLength({min: 0, max: 1280})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
            check("meanings")
                .not()
                .isEmpty()
                .withMessage("meanings is empty")
        ]
    }

    static wordUpdateRules = () => {
        return [
            check("word")
                .not()
                .isEmpty()
                .withMessage("word is empty")
                .isLength({min: 0, max: 1280})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
            check("meanings")
                .not()
                .isEmpty()
                .withMessage("meanings is empty"),
            check("id")
                .not()
                .isEmpty()
                .withMessage("id is empty")
                .isLength({min: 0, max: 128})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),
        ]
    }

    static wordDeleteRules = () => {
        return [
            check("id")
                .not()
                .isEmpty()
                .withMessage("id is empty")
                .isLength({min: 0, max: 128})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),

        ]
    }

    static quoteCreateRules = () => {
        return [
            check("data")
                .not()
                .isEmpty()
                .withMessage("data is empty")
        ]
    }

    static quoteUpdateRules = () => {
        return [
            check("data")
                .not()
                .isEmpty()
                .withMessage("data is empty")
        ]
    }

    static quoteDeleteRules = () => {
        return [
            check("id")
                .not()
                .isEmpty()
                .withMessage("id is empty")
                .isLength({min: 0, max: 128})
                .withMessage("Length less than 6 characters or more then 1280")
                .trim(),

        ]
    }


}

export default Validator
