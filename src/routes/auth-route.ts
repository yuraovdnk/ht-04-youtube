import {Request, Response, Router} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../domain/application/jwt-service";


export const authRoute = Router()

authRoute.post('/login',async (req: Request, res: Response)=>{
    const user = await usersService.checkCredentials(req.body.login, req.body.password)
    if(user){
        const token = await jwtService.createJWT(user)
        res.status(200).send({token})
        return
    }
    res.status(401)
})