import {UserType} from "../../repositories/types";
import jwt from 'jsonwebtoken'
import {settings} from "../../settings";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(user: UserType) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: '1h'})
    },
    async getUserIdByToken(token: string) {
        try {
            const result:any = jwt.verify(token, settings.JWT_SECRET)
            return result.userId
        } catch (e) {
            return null
        }
    }
}