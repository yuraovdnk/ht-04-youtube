import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";

export const idValidator = (req: Request, res: Response, next: NextFunction) => {

    Object.keys(req.params).map(key => {
        if (req.params[key].length === 24) {
            next()
            return;
        }
        res.status(404).send()
        return;
    })
}
