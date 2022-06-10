import {usersCollection} from "./db";
import {UserType, UserTypeRes} from "./types";
import {paginateType, pagination, paginateRes} from "./pagination";
import {ObjectId} from "mongodb";


export const usersRepository = {
    async createUser(newUser: UserType): Promise<boolean> {
        const result = await usersCollection.insertOne(newUser)
        return result.acknowledged

    },
    async getAllUsers(query: paginateType):Promise<paginateRes>{
        const filter = {}
        const options = {id:1,login:1}
        const users = await pagination(query, filter,usersCollection,options)
        return users

    },

    async findByLogin(login:string):Promise<UserType | null>{
        return await usersCollection.findOne({login})
    },
    async findById(id: ObjectId):Promise<UserType | null>{
        return await usersCollection.findOne({id})
    },
    async deleteUser(id:ObjectId):Promise<boolean>{
        const res = await usersCollection.deleteOne({id})
        return res.acknowledged
    }

}