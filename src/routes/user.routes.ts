import { Router } from 'express'
import UserController from '../controllers/user.controller'
import { authenticate, authenticateRefresh } from '../middleware/jwt.config'

const userRouter = Router()

userRouter.post("/api/login", UserController.login);
userRouter.get("/api/users", authenticate, UserController.getAllUsers);
userRouter.get("/api/users/:id", authenticate, UserController.getUserById); 
userRouter.patch("/api/users", authenticate, UserController.update); 
userRouter.post("/api/mngregister", authenticate, UserController.managerRegister);
userRouter.post("/api/logout", UserController.logout); 

userRouter.get("/api/refresh", authenticateRefresh, UserController.refreshToken);

export default userRouter