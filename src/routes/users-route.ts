import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {basicAuth} from "../middlewares/basic-auth";
import {paginateType} from "../repositories/pagination";
import {ObjectId} from "mongodb";
import {usersValidate} from "../middlewares/users-validator";
import {idValidator} from "../middlewares/id-validator";


export const usersRoute = Router()


usersRoute.post('/', basicAuth,usersValidate, async (req: Request, res: Response) => {

    const newUser = await usersService.createUser(req.body.login, req.body.password)
    if(newUser){
        res.status(201).send(newUser)
        return
    }
    res.send(400)
})

usersRoute.get('/', async (req: Request, res: Response) => {
    const allUsers = await usersService.getAllUsers(req.query as paginateType)
    res.send(allUsers)
})

usersRoute.delete('/:id',basicAuth,idValidator,async (req: Request, res: Response)=>{
   const isDeleted = await usersService.deleteUser(new ObjectId(req.params.id))
    if(isDeleted){
        return res.send(200)
    }
    res.send(404)
})


