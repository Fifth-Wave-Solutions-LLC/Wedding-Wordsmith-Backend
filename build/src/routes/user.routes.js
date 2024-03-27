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
userRouter.get("/api/users", jwt_config_1.authenticate, user_controller_1.default.getAllUsers);
userRouter.get("/api/users/:id", jwt_config_1.authenticate, user_controller_1.default.getUserById);
userRouter.patch("/api/users", jwt_config_1.authenticate, user_controller_1.default.update);
userRouter.post("/api/mngregister", jwt_config_1.authenticate, user_controller_1.default.managerRegister);
userRouter.post("/api/logout", user_controller_1.default.logout);
userRouter.get("/api/refresh", jwt_config_1.authenticateRefresh, user_controller_1.default.refreshToken);
exports.default = userRouter;
