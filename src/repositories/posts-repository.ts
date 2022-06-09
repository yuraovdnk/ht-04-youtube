import {paginateRes, paginateType, pagination} from "./pagination";
import {commentsCollection, postsCollection} from "./db";
import {CommentType, postsType} from "./types";

export const postsRepository = {

    async getPosts(query: paginateType):Promise<paginateRes> {
        let filter =  {}
        return await pagination(query,filter,postsCollection)
    },

    async createPost(newPost: postsType):Promise<boolean>{
        const result = await postsCollection.insertOne(newPost)
        return result.acknowledged
    },

    async getPostById(id:number):Promise<postsType | null>{
        return await postsCollection.findOne({id},{projection:{_id:false}})
    },

    async updatePost(body : postsType, id:number):Promise<boolean>{
        const result = await postsCollection.updateOne({id},{
            $set : {title: body.title,shortDescription:body.shortDescription,content:body.content,bloggerId:body.bloggerId}})
        return result.matchedCount === 1
    },

    async deletePost(id:number):Promise<boolean>{
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    },

    async getPostByBloggerId(bloggerId:number,query:paginateType):Promise<paginateRes>{
        let filter = {bloggerId}
        return await pagination(query,filter,postsCollection)
    },
///comments
    async createComment(comment : CommentType):Promise<boolean>{
        const res = await commentsCollection.insertOne(comment)
        return res.acknowledged
    },
    async getCommentByPostId(postId:number,query:paginateType):Promise<paginateRes>{
        const filter = {postId}
        let options = {postId:0}
        return await pagination(query,filter,commentsCollection,options)

    }


}