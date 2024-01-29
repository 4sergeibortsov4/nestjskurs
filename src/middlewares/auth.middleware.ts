import { UserService } from "../user/user.service"
import { JWT_SECRET } from "../config"
import { ExpressRequestInterface } from "@app/types/expressRequest.interface"
import { Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction, Response } from "express"
import { verify } from 'jsonwebtoken'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {}
    async use(req: ExpressRequestInterface, res: Response, next: NextFunction){
        if(!req.headers.authorization){
            req.user = null
            next()
            return 
        }

        const token = req.headers.authorization.split(' ')[1]
        console.log('token', token)
        try {
            const decode = verify(token, JWT_SECRET)
            const user = await this.userService.findById(decode.id)
            req.user = user
            next()
        } catch (error) {
            req.user = null
            next()
        }
    }
}