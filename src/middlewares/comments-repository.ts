import {commentsCollection} from "../repositories/db";
import {CommentType} from "../repositories/types";


export const commentsRepository = {
    async getCommentById(id: number):Promise<CommentType | null> {
        return await commentsCollection.findOne({id})
    },
    async updateComment(id: number, content: string):Promise<boolean> {
        const result = await commentsCollection.updateOne({id},{$set:{content}})
        return result.acknowledged
    },
    async deleteComment(id: number):Promise<boolean> {
       const result = await commentsCollection.deleteOne({id})
        return result.acknowledged
    }
}