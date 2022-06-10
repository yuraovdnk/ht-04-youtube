import {ObjectId, WithId} from "mongodb";

export type bloggerType = {
    id: ObjectId
    name: string
    youtubeUrl: string
}
export type postsType = {
    id: ObjectId
    title: string
    shortDescription: string
    content:string
    bloggerId:ObjectId
}
export type UserType = {
    id:ObjectId
    login:string,
    passwordHash:string,
    passwordSalt:string,
    createdAt:Date
}
export type UserTypeRes = {
    id:ObjectId,
    login:string
}
export type CommentType = {
    id:ObjectId,
    content:string,
    userId:ObjectId,
    postId?:ObjectId,
    userLogin?:string,
    addedAt:Date
}

