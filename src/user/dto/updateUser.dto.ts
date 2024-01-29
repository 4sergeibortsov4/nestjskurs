import { IsEmail } from "class-validator"

export class updateUserDto {
    readonly username: string

    @IsEmail()
    readonly email: string

    readonly bio: string
    
    readonly image: string
}