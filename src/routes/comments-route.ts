import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {bearerAuth} from "../middlewares/bearer-auth";
import {ObjectId} from "mongodb";
import {idValidator} from "../middlewares/validators/id-validator";
import {commentValidation} from "../middlewares/validators/comment-validators";


export const commentsRoute = Router()

commentsRoute.get('/:id',idValidator,async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(new ObjectId(req.params.id))
    if (comment) {
        return res.status(200).send(comment)
    }
    res.send(404)

})

commentsRoute.put('/:id',bearerAuth,idValidator,commentValidation, async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(new ObjectId(req.params.id))

    if (!comment) {
        return res.send(404)
    }

    if (comment.userId.toString() !== req.user!.id.toString()) {
        return res.send(403)
    }
    const isUpdated = await commentsService.updateComment(new ObjectId(req.params.id), req.body.content);
    if (isUpdated) {
        return res.send(204)
    }
})

commentsRoute.delete('/:id', bearerAuth,idValidator, async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(new ObjectId(req.params.id))
    if (!comment) {
        return res.send(404)
    }
    if (comment.userId.toString() !== req.user!.id.toString()) {
        return res.send(403)
    }
    const isDeleted = await commentsService.deleteComment(new ObjectId(req.params.id))
    if (isDeleted) {
        return res.send(204)
    }
})