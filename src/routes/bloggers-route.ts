import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {paginateType} from "../repositories/pagination";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsService} from "../domain/posts-service";
import {basicAuth} from "../middlewares/basic-auth";
import {postsValidate} from "../middlewares/posts-validator";
import {bloggersValidate} from "../middlewares/bloggers-validator";
import {ObjectId} from "mongodb";
import {idValidator} from "../middlewares/id-validator";

export const bloggersRoute = Router()

bloggersRoute.get('/', async (req: Request, res: Response) => {
    const bloggers = await bloggersService.getBloggers(req.query as paginateType)
    res.status(200).send(bloggers)
})

bloggersRoute.get('/:id',idValidator, async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggerById(new ObjectId(req.params.id))
    if (blogger) {
        res.status(200).send(blogger)
        return
    }
    res.status(404)
})

bloggersRoute.post('/', basicAuth, bloggersValidate, async (req: Request, res: Response) => {
    const newBlogger = await bloggersService.createBlogger(req.body)
    if (newBlogger) {
        res.status(201).send(newBlogger)
        return
    }
    res.status(404)
})

bloggersRoute.put('/:id', basicAuth,idValidator, bloggersValidate, async (req: Request, res: Response) => {
    const foundBlogger = await bloggersRepository.getBloggerById(new ObjectId(req.params.id))
    if (foundBlogger) {
        const isUpdated = await bloggersService.updateBlogger(new ObjectId(req.params.id), req.body)
        if (isUpdated) {
            return res.status(204)

        }
        return res.status(400)

    }
    res.send(404)
})

bloggersRoute.delete('/:id', basicAuth,idValidator, async (req: Request, res: Response) => {
    const isDeleted = await bloggersService.deleteBlogger(new ObjectId(req.params.id))
    if (isDeleted) {
        return res.status(204)

    }
    res.status(404)
})


bloggersRoute.get('/:bloggerId/posts',idValidator, async (req: Request, res: Response) => {
    const bloggerExist = await bloggersService.getBloggerById(new ObjectId(req.params.bloggerId))
    if (bloggerExist) {
        const post = await postsService.getPostByBloggerId(new ObjectId(req.params.bloggerId), req.query as paginateType)
        res.status(200).send(post)
        return
    }
    res.status(404)
})

bloggersRoute.post('/:bloggerId/posts', basicAuth,idValidator, postsValidate, async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggerById(new ObjectId(req.params.bloggerId))
    if (blogger) {
        const createdPost = await postsService.createPost(req.body, blogger)
        return res.status(201).send(createdPost)
    }
    res.status(404)
})


