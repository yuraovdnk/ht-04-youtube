import {Response, Request, Router} from "express";
import {postsService} from "../domain/posts-service";
import {paginateType} from "../repositories/pagination";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {bloggersService} from "../domain/bloggers-service";
import {basicAuth} from "../middlewares/basic-auth";
import {postsValidate} from "../middlewares/validators/posts-validator";
import {bearerAuth} from "../middlewares/bearer-auth";
import {ObjectId} from "mongodb";
import {idValidator} from "../middlewares/validators/id-validator";
import {commentValidation} from "../middlewares/validators/comment-validators";


export const postsRoute = Router()

postsRoute.get('/', async (req:  Request, res: Response) => {
    const bloggers = await postsService.getPosts(req.query as paginateType)
    res.send(bloggers)
})

postsRoute.get('/:id',idValidator, async (req: Request, res: Response) => {
    const post = await postsService.getPostById(new ObjectId(req.params.id))
    if (!post) {
        res.send(404)
        return
    }
    res.status(200).send(post)
})

postsRoute.post('/',basicAuth,postsValidate, async (req: Request, res: Response) => {
    const blogger = await bloggersRepository.getBloggerById(new ObjectId(req.body.bloggerId))

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
        res.send(400)
        return
    }

    res.status(201).send(post)
})

postsRoute.put('/:id',basicAuth, idValidator, postsValidate,async (req: Request, res: Response) => {
    const isExistPost = await postsService.getPostById(new ObjectId(req.params.id))

    if (!isExistPost) {
        res.send(404)
        return
    }

    const isExistBlogger = await bloggersService.getBloggerById(new ObjectId(req.body.bloggerId))

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

    const isUpdated = await postsService.updatePost(req.body, new ObjectId(req.params.id))

    if (!isUpdated) {
        res.send(400)
        return
    }

    res.send(204)
})

postsRoute.delete('/:id',basicAuth,idValidator,async (req: Request, res: Response)=>{
    const isDeleted = await postsService.deletePost(new ObjectId(req.params.id))
    if(isDeleted){
        res.send(204)
        return
    }
    res.send(404)

})
///comments
postsRoute.post('/:postId/comments',bearerAuth,idValidator,commentValidation,async (req: Request, res: Response)=>{
    const existPost = await postsService.getPostById(new ObjectId(req.params.postId))
    if(existPost){
        const createPost = await postsService.createComment(new ObjectId(req.params.postId),req.body.content, req.user!)
        if(createPost){
            return res.status(201).send(createPost)
        }
    }
    res.send(404)
})

postsRoute.get('/:postId/comments',idValidator,async (req: Request, res: Response)=>{
    const existPost = await postsService.getPostById(new ObjectId(req.params.postId))
    if(existPost){
        const allComments = await postsService.getCommentByPostId(new ObjectId(req.params.postId),req.query as paginateType)
        return res.status(200).send(allComments)
    }
    res.send(404)
})
