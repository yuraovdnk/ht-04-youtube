import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {paginateType} from "../repositories/pagination";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsService} from "../domain/posts-service";
import {basicAuth} from "../middlewares/basic-auth";
import {postsValidate} from "../middlewares/posts-validator";
import {bloggersValidate} from "../middlewares/bloggers-validator";

export const bloggersRoute = Router()

bloggersRoute.get('/', async (req: Request, res: Response) => {
    const bloggers = await bloggersService.getBloggers(req.query as paginateType)
    res.status(200).send(bloggers)
})

bloggersRoute.get('/:id', async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggerById(+req.params.id)
    if (blogger) {
        res.status(200).send(blogger)
        return
    }
    res.send(404)
})

bloggersRoute.post('/', basicAuth, bloggersValidate, async (req: Request, res: Response) => {
    const newBlogger = await bloggersService.createBlogger(req.body)
    if (newBlogger) {
        res.status(201).send(newBlogger)
        return
    }
    res.send(404)
})

bloggersRoute.put('/:id', basicAuth, bloggersValidate, async (req: Request, res: Response) => {
    const foundBlogger = await bloggersRepository.getBloggerById(+req.params.id)
    if (foundBlogger) {
        const isUpdated = await bloggersService.updateBlogger(+req.params.id, req.body)
        if (isUpdated) {
            res.send(204)
            return
        }
        res.send(400)
        return
    }
    res.send(404)
})

bloggersRoute.delete('/:id', basicAuth, async (req: Request, res: Response) => {
    const isDeleted = await bloggersService.deleteBlogger(+req.params.id)
    if (isDeleted) {
        res.send(204)
        return
    }
    res.send(404)
})


bloggersRoute.get('/:bloggerId/posts', async (req: Request, res: Response) => {
    const bloggerExist = await bloggersService.getBloggerById(+req.params.bloggerId)
    if (bloggerExist) {
        const post = await postsService.getPostByBloggerId(+req.params.bloggerId, req.query as paginateType)
        res.status(200).send(post)
        return
    }
    res.send(404)
})

bloggersRoute.post('/:bloggerId/posts', basicAuth, postsValidate, async (req: Request, res: Response) => {
    const blogger = await bloggersService.getBloggerById(+req.params.bloggerId)
    if (blogger) {
        const createdPost = await postsService.createPost(req.body, blogger)
        res.status(201).send(createdPost)
        return
    }
    res.send(404)
})


