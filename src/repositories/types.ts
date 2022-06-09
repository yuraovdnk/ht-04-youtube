import {ObjectId, WithId} from "mongodb";

export type bloggerType = {
    id: number
    name: string
    youtubeUrl: string
}
export type postsType = {
    id: number
    title: string
    shortDescription: string
    content:string
    bloggerId:number
}
export type UserType = {
    id:number
    login:string,
    passwordHash:string,
    passwordSalt:string,
    createdAt:Date
}
export type UserTypeRes = {
    id:number,
    login:string
}
export type CommentType = {
    id:number,
    content:string,
    userId:number,
    postId?:number,
    userLogin?:string,
    addedAt:Date
}

