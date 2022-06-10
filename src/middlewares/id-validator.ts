import {NextFunction, Request, Response} from "express";

export const idValidator = (req: Request, res: Response, next: NextFunction) => {
    Object.keys(req.params).map(key => {
        if (req.params[key].length < 25) {
            next()
            return;
        }
        res.status(404)
    })
}
