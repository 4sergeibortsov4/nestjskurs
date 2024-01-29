import { ArticleType } from "./article.type"

export interface articlesResponseInterface {
    articles: ArticleType[],
    articlesCount: number
}