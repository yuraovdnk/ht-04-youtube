import {paginateRes, paginateType} from "../repositories/pagination";
import {postsRepository} from "../repositories/posts-repository";
import {bloggerType, CommentType, postsType, UserType} from "../repositories/types";
import {ObjectId} from "mongodb";

export const postsService = {
    async getPosts(query: paginateType): Promise<paginateRes> {
        return await postsRepository.getPosts(query)
    },

    async getPostById(id: number): Promise<postsType | null> {
        return await postsRepository.getPostById(id)
    },

    async createPost(body: postsType, blogger: bloggerType): Promise<postsType | boolean> {
        const newPost = {
            id: Date.now(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            bloggerId: blogger.id,
            bloggerName: blogger.name
        }

        const result = await postsRepository.createPost({...newPost})
        if (result) {
            return newPost
        }
        return result
    },

    async updatePost(body: postsType, id: number): Promise<boolean> {
        return await postsRepository.updatePost(body, id)
    },

    async deletePost(id: number): Promise<boolean> {
        return await postsRepository.deletePost(id)
    },

    async getPostByBloggerId(bloggerId: number, query: paginateType): Promise<paginateRes> {
        return await postsRepository.getPostByBloggerId(bloggerId, query)
    },
///comment
    async createComment(postId: number, content: string, user: UserType): Promise<CommentType | boolean> {
        console.log(user)
        const newComment = {
            id: Date.parse(new Date().toString()),
            content,
            postId,
            userId: user.id,
            userLogin:user.login,
            addedAt: new Date()
        }
        const comment = await postsRepository.createComment(newComment)
        if (comment) {
            return {
                id: newComment.id,
                content: newComment.content,
                userId: user.id,
                userLogin: newComment.userLogin,
                addedAt: newComment.addedAt
            }
        }
        return false

    },

    async getCommentByPostId(postId: number, query: paginateType): Promise<paginateRes> {
        return await postsRepository.getCommentByPostId(postId, query)
    }
}