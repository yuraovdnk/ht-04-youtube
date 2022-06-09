import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users-repository";
import {UserType, UserTypeRes} from "../repositories/types";
import {paginateRes, paginateType} from "../repositories/pagination";
import {usersCollection} from "../repositories/db";


export const usersService = {
    async createUser(login: string, password: string):Promise<UserTypeRes | false> {
        const candidate = await usersRepository.findByLogin(login)
        if(candidate){
            return false // уже такой пользователь есть
        }
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this.generateHash(password,passwordSalt)
        const newUser = {
            id: Date.now(),
            login,
            passwordSalt,
            passwordHash,
            createdAt: new Date()
        }
        const user = await usersRepository.createUser(newUser)
        if(user){
            return {
                id:newUser.id,
                login: newUser.login
            }
        }
        return false
    },

    async getAllUsers(query:paginateType):Promise<paginateRes>{
        return await usersRepository.getAllUsers(query)
    },

    async generateHash(password:string,salt:string){
        const hash = await bcrypt.hash(password,salt)
        return hash
    },

    async deleteUser(id: number):Promise<boolean>{
        return await usersRepository.deleteUser(id)
    },

    async checkCredentials(login:string,password:string){
        const candidate = await usersRepository.findByLogin(login)
        if(!candidate){
            return false//логин указаан неправильный, т.е. Юзер не найден
        }
        const passwordHash = await this.generateHash(password,candidate.passwordSalt)
       if(candidate.passwordHash !== passwordHash){
           return false//Пароль указан не верно
       }
       return candidate

    },
    async getUserById(id:number):Promise<UserType | null>{
        return usersRepository.findById(id)
    }

}