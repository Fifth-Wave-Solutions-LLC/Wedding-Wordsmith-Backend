"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = __importDefault(require("../controllers/article.controller"));
const articleRouter = (0, express_1.Router)();
articleRouter.get("/api/articles", article_controller_1.default.getAllArticles); // add middleware
// articleRouter.get("/api/articles/:id",  ArticleController.getArticleById); // add middleware
articleRouter.post("/api/articles", article_controller_1.default.createArticle);
// articleRouter.put("/api/articles/:id",  ArticleController.updateArticle); // add middleware
// articleRouter.delete("/api/article/:id", ArticleController.deleteArticle); 
exports.default = articleRouter;
