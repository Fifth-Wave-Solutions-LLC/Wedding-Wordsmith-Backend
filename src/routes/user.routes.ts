import { Router } from 'express'
import UserController from '../controllers/user.controller'
import { authenticate, authenticateRefresh } from '../middleware/jwt.config'

const userRouter = Router()

userRouter.post("/api/login", UserController.login);
userRouter.post("/api/users/create",  UserController.create); // add middleware
userRouter.put("/api/users/:id",  UserController.updateUser); // add middleware
userRouter.post("/api/register", UserController.register);
userRouter.post("/api/logout", UserController.logout); 

userRouter.get("/api/refresh", authenticateRefresh, UserController.refreshToken);

export default userRouter