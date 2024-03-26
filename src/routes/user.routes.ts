import { Router } from 'express'
import UserController from '../controllers/user.controller'
import { authenticate, authenticateRefresh } from '../middleware/jwt.config'

const userRouter = Router()

userRouter.post("/api/login", UserController.login);
userRouter.get("/api/users", UserController.getAllUsers);// add middleware
// userRouter.post("/api/users", UserController.create); 
userRouter.put("/api/users/:id",  UserController.update); // add middleware
userRouter.post("/api/mngregister", UserController.managerRegister);
userRouter.post("/api/logout", UserController.logout); 

userRouter.get("/api/refresh", authenticateRefresh, UserController.refreshToken);

export default userRouter