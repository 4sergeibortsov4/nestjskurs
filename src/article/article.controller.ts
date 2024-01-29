import { Body, Controller, Delete, Get, Param, Post, UseGuards, Put, UsePipes, ValidationPipe, Query } from "@nestjs/common"
import { ArticleService } from "./article.service"
import { AuthGuard } from "../user/guards/auth.guard"
import { User } from "../user/decorators/user.decorator"
import { UserEntity } from "../user/user.entity"
import { createArticleDto } from "./dto/createArticle.dto"
import { articleResponseInterface } from "./types/articleResponse.interface"
import { articlesResponseInterface } from "./types/articlesResponse.interface"
import { BackendValidationPipe } from "../shared/pipes/backendValidation.pipe"

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    async findAll(@User('id') currentUserId: number, @Query() query: any): Promise<articlesResponseInterface> {
        return await this.articleService.findAll(currentUserId, query)
    }

    @Post()
    @UsePipes(new BackendValidationPipe)
    @UseGuards(AuthGuard)
    async createArticle(@User() currentUser: UserEntity, @Body('article') createArticleDto: createArticleDto): Promise<articleResponseInterface>
    {
        const article = await this.articleService.createArticle(currentUser, createArticleDto)
        return this.articleService.buildArticleResponse(article)
    }

    @Get(':slug')
    async getSingleArticle(@Param('slug') slug: string): Promise<articleResponseInterface> {
        const article = await this.articleService.findBySlug(slug)
        return this.articleService.buildArticleResponse(article)
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string) {
        return await this.articleService.deleteArticle(slug, currentUserId)
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    @UsePipes(new BackendValidationPipe)
    async updateArticle(@User('id') currentUserId: number, @Param('slug') slug: string, @Body('article') updateArticleDto: createArticleDto): Promise<articleResponseInterface> {
        const article = await this.articleService.updateArticle(slug, currentUserId, updateArticleDto,)
        return this.articleService.buildArticleResponse(article)
    }

    @Post(':slug/favorite')
    @UseGuards(AuthGuard)
    async addArticleToFavorite(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<articleResponseInterface> {
        const article = await this.articleService.addArticleToFavourites(slug, currentUserId)
        return this.articleService.buildArticleResponse(article)
    }

    @Delete(':slug/favorite')
    @UseGuards(AuthGuard)
    async deleteArticleFromFavorite(@User('id') currentUserId: number, @Param('slug') slug: string): Promise<articleResponseInterface> {
        const article = await this.articleService.deleteArticleFromFavourites(slug, currentUserId)
        return this.articleService.buildArticleResponse(article)
    }

    @Get()
    @UseGuards(AuthGuard)
    async getFeed(@User('id') currentUserId: number, @Query() query: any): Promise<articlesResponseInterface>{
        return await this.articleService.getFeed(currentUserId, query)
    }
}