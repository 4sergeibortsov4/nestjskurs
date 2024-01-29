import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TagModule } from './tag/tag.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import ormconfig from './ormconfig'
import { UserModule } from './user/user.module'
import { AuthMiddleware } from './middlewares/auth.middleware'
import { ArticleModule } from './article/article.module'
import { ProfileModule } from './profile/profile.module'

@Module({
  imports: [TagModule, UserModule, TypeOrmModule.forRoot(ormconfig), ArticleModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}