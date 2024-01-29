import { User } from "../user/decorators/user.decorator";
import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProfileResponseInterface } from "./types/profileResponse.interface";
import { ProfileService } from "./profile.service";
import { AuthGuard } from "../user/guards/auth.guard";

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileservice: ProfileService) {}

    @Get(':username')
    async getProfile(@User('id') currentUserId: number, @Param('username') profileUsername: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileservice.getProfile(currentUserId, profileUsername)
        return this.profileservice.buildProfileResponse(profile)
    }

    @Post(':username/follow')
    @UseGuards(AuthGuard)
    async followProfile(@User('id') currentUserId: number, @Param('username') profileUsername: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileservice.followProfile(currentUserId, profileUsername)
        return this.profileservice.buildProfileResponse(profile)
    }

    @Delete(':username/follow')
    @UseGuards(AuthGuard)
    async unfollowProfile(@User('id') currentUserId: number, @Param('username') profileUsername: string): Promise<ProfileResponseInterface> {
        const profile = await this.profileservice.unfollowProfile(currentUserId, profileUsername)
        return this.profileservice.buildProfileResponse(profile)
    }

    
}