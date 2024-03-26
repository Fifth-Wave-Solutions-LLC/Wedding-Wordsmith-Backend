"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const jwt_config_1 = require("../middleware/jwt.config");
const userRouter = (0, express_1.Router)();
userRouter.post("/api/login", user_controller_1.default.login);
userRouter.get("/api/users", user_controller_1.default.getAllUsers); // add middleware
// userRouter.post("/api/users", UserController.create); 
userRouter.put("/api/users/:id", user_controller_1.default.update); // add middleware
userRouter.post("/api/mngregister", user_controller_1.default.managerRegister);
userRouter.post("/api/logout", user_controller_1.default.logout);
userRouter.get("/api/refresh", jwt_config_1.authenticateRefresh, user_controller_1.default.refreshToken);
exports.default = userRouter;
