import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { createUserDto } from "./dto/createuser.dto"
import { UserEntity } from "./user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { sign } from "jsonwebtoken"
import { JWT_SECRET } from "../config"
import { userResponseInterface } from "./types/userResponse.interface"
import { loginUserDto } from "./dto/loginUser.dto"
import {compare} from 'bcrypt'
import { updateUserDto } from "./dto/updateUser.dto"

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async createUser(createUserDto: createUserDto): Promise<UserEntity> {
        const errorResponce = { 
            errors: {}
        }
        const userByEmail = await this.userRepository.findOne({ 
            where: {
                email: createUserDto.email
            }
        })
        const userByUsername = await this.userRepository.findOne({ 
            where: {
                username: createUserDto.username
            }
        })

        if(userByEmail) {
            errorResponce.errors['email'] = 'has already been taken'
        }
        if(userByUsername) {
            errorResponce.errors['username'] = 'has already been taken'
        }
        if(userByEmail || userByUsername){
            throw new HttpException(errorResponce, HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto)
        return await this.userRepository.save(newUser)
    }

    buildUserResponse(user: UserEntity): userResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJWT(user)
            }
        }
    }
    generateJWT(user: UserEntity): string {
       return sign({
        id: user.id,
        username: user.username,
        email: user.email                    
       }, JWT_SECRET)
    }

    async loginUser(loginUserDto: loginUserDto): Promise<UserEntity>{
        const user = await this.userRepository.findOne({
            select: ['id', 'username', 'email', 'bio', 'image', 'password'],
            where: {
                email: loginUserDto.email
            }
        })

        if(!user) {
            throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const isPasswordCorrect = compare(loginUserDto.password, user.password)

        if(!isPasswordCorrect) {
            throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
        }

        delete user.password

        return user
    }

    findById(id: number): Promise<UserEntity>{
        return this.userRepository.findOne({where: {id: id}})
    }

    async updateUser(userId: number, updateUserDto: updateUserDto): Promise<UserEntity>{
        const user = await this.findById(userId)
        Object.assign(user, updateUserDto)
        return await this.userRepository.save(user)
    }
}