import { Router } from 'express'
import ArticleController from '../controllers/article.controller'
import { authenticate } from '../middleware/jwt.config'

const articleRouter = Router()

articleRouter.get("/api/articles",  ArticleController.getAllArticles); // add middleware
// articleRouter.get("/api/articles/:id",  ArticleController.getArticleById); // add middleware
articleRouter.post("/api/articles", ArticleController.createArticle);
// articleRouter.put("/api/articles/:id",  ArticleController.updateArticle); // add middleware
// articleRouter.delete("/api/article/:id", ArticleController.deleteArticle); 

export default articleRouter
