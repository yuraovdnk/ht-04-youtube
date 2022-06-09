import {Response, Request, Router} from "express";
import {postsService} from "../domain/posts-service";
import {paginateType} from "../repositories/pagination";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {bloggersService} from "../domain/bloggers-service";
import {basicAuth} from "../middlewares/basic-auth";
import {postsValidate} from "../middlewares/posts-validator";
import {bearerAuth} from "../middlewares/bearer-auth";


export const postsRoute = Router()

postsRoute.get('/', async (req:  Request, res: Response) => {
    res.send(await postsService.getPosts(req.query as paginateType))
})

postsRoute.get('/:id', async (req: Request, res: Response) => {
    const post = await postsService.getPostById(+req.params.id)
    if (!post) {
        res.send(404)
        return
    }
    res.status(200).send(post)
})

postsRoute.post('/',basicAuth,postsValidate, async (req: Request, res: Response) => {
    const blogger = await bloggersRepository.getBloggerById(+req.body.bloggerId)

    if (!blogger) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "Invalid 'bloggerId': such blogger doesn't exist",
                    "field": "bloggerId"
                }
            ],
            "resultCode": 1
        })
        return
    }

    const post = await postsService.createPost(req.body, blogger)

    if (!post) {
        res.status(400).send()
        return
    }

    res.status(201).send(post)
})

postsRoute.put('/:id',basicAuth, postsValidate,async (req: Request, res: Response) => {
    const isExistPost = await postsService.getPostById(+req.params.id)

    if (!isExistPost) {
        res.send(404)
        return
    }

    const isExistBlogger = await bloggersService.getBloggerById(+req.body.bloggerId)

    if (!isExistBlogger) {
        res.status(400).send({
            "errorsMessages": [
                {
                    "message": "Invalid 'bloggerId': such blogger doesn't exist",
                    "field": "bloggerId"
                }
            ],
            "resultCode": 1
        })
        return
    }

    const isUpdated = await postsService.updatePost(req.body, +req.params.id)

    if (!isUpdated) {
        res.send(400)
        return
    }

    res.send(204)
})

postsRoute.delete('/:id',basicAuth,async (req: Request, res: Response)=>{
    const isDeleted = await postsService.deletePost(+req.params.id)
    if(isDeleted){
        res.send(204)
        return
    }
    res.send(404)

})
///comments
postsRoute.post('/:postId/comments',bearerAuth,async (req: Request, res: Response)=>{
    const existPost = await postsService.getPostById(+req.params.postId)
    if(existPost){
        const createPost = await postsService.createComment(+req.params.postId,req.body.content, req.user!)
        if(createPost){
            return res.status(201).send(createPost)
        }
    }
    res.send(404)
})

postsRoute.get('/:postId/comments',async (req: Request, res: Response)=>{
    const existPost = await postsService.getPostById(+req.params.postId)
    if(existPost){
        const allComments = await postsService.getCommentByPostId(+req.params.postId,req.query as paginateType)
        return res.status(200).send(allComments)
    }
    res.send(404)
})
