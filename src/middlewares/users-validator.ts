import {body} from "express-validator";


export const loginValidator = body('login')
    .exists().withMessage('The Login field is required.')
    .isString().withMessage('The Login field must be string')
    .notEmpty().withMessage("Login must be not empty")
    .isLength({min:3,max:30}).withMessage(`The field Login must be a string of \'30\'.`)

export const passwordValidator = body('login')
    .exists().withMessage('The password field is required.')
    .isString().withMessage('The password field must be string')
    .notEmpty().withMessage("password must be not empty")
    .isLength({min:6,max:20}).withMessage(`The field password must be a string of \'30\'.`)


export const usersValidate = [
    loginValidator,
    passwordValidator
]
