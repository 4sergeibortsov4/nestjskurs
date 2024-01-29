import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common"
import { UserService } from "./user.service"
import { createUserDto } from "./dto/createuser.dto"
import { userResponseInterface } from "./types/userResponse.interface"
import { loginUserDto } from "./dto/loginUser.dto"
import { User } from "./decorators/user.decorator"
import { UserEntity } from "./user.entity"
import { AuthGuard } from "./guards/auth.guard"
import { updateUserDto } from "./dto/updateUser.dto"
import { BackendValidationPipe } from "../shared/pipes/backendValidation.pipe"

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post('users')
    @UsePipes(new BackendValidationPipe())
    async createUser(@Body('user') createUserDto: createUserDto): Promise<userResponseInterface>{
        const user = await this.userService.createUser(createUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Post('users/login')
    @UsePipes(new BackendValidationPipe())
    async loginUser(@Body('user') loginUserDto: loginUserDto): Promise<userResponseInterface> {
        const user = await this.userService.loginUser(loginUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<userResponseInterface> {
        return this.userService.buildUserResponse(user)
    }

    @Put('user')
    @UseGuards(AuthGuard)
    async updateCurrentUser(@User('id') currentUserId: number, @Body('user') updateUserDto: updateUserDto): Promise<userResponseInterface> {
         const user = await this.userService.updateUser(currentUserId, updateUserDto)
         return this.userService.buildUserResponse(user)
    }
}