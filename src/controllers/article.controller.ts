import { NextFunction, Request, Response } from "express";
import ArticleModel, { IArticle } from "../models/article.model";


const getAllArticles = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allArticles = await ArticleModel.find({})
    res.status(200).json(allArticles)
  } catch (err) {
    res.status(400).json(err);
  }
}
const createArticle = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newArticle = await ArticleModel.create(req.body)
    res.status(200).json(newArticle)
  } catch (err) {
    res.status(400).json(err);
  }
}

export default { getAllArticles, createArticle }  