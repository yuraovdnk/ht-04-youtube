import {commentsRepository} from "../middlewares/comments-repository";
import {CommentType} from "../repositories/types";


export const commentsService = {

    async getCommentById(id:number):Promise<CommentType | null>{
        const comment = await commentsRepository.getCommentById(id)
        if(comment){
            return {
                id:comment.id ,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                addedAt: comment.addedAt
            }
        }
        return null
    },

    async updateComment(id: number,content:string):Promise<boolean> {
        return await commentsRepository.updateComment(id,content)
    },
    async deleteComment(id: number):Promise<boolean> {
        return await commentsRepository.deleteComment(id)

    }
}