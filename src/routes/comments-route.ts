import {Request, Response, Router} from "express";
import {commentsService} from "../domain/comments-service";
import {bearerAuth} from "../middlewares/bearer-auth";


export const commentsRoute = Router()

commentsRoute.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(+req.params.id)
    if (comment) {
        return res.status(200).send(comment)
    }
    res.send(404)

})
commentsRoute.put('/:id', bearerAuth, async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(+req.params.id)
    if (!comment) {
        return res.send(404)
    }

    if (comment.userId !== req.user!.id) {
        return res.send(403)
    }
    const isUpdated = await commentsService.updateComment(+req.params.id, req.body.content);
    if (isUpdated) {
        return res.send(200)
    }
})
commentsRoute.delete('/:id', bearerAuth, async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(+req.params.id)
    if (!comment) {
        return res.send(404)
    }
    if (comment.userId !== req.user!.id) {
        return res.send(403)
    }
    const isDeleted = await commentsService.deleteComment(+req.params.id)
    if (isDeleted) {
        return res.send(204)
    }
})