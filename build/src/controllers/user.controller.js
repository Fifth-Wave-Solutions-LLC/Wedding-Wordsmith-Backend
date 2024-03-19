"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const server_1 = require("../../server");
const ACCESS_TOKEN_DURATION = '15s'; // TODO reduce this once cookies are working
const REFRESH_TOKEN_DURATION = '60d';
const REFRESH_COOKIE_MAXAGE = 60 * 24 * 60 * 60 * 1000;
function generateAccessToken(user) {
    const accessToken = jwt.sign({ _id: user._id }, server_1.SECRET.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_DURATION });
    return accessToken;
}
function generateRefreshToken(user) {
    const refreshToken = jwt.sign({ _id: user._id }, server_1.SECRET.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_DURATION });
    return refreshToken;
}
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Login attempt by ${req.body.userName}`);
    req.body.userName = req.body.userName.toLowerCase();
    console.log(`Login string used: ${req.body.userName}`);
    try {
        const user = yield user_model_1.default.findOne({ userName: req.body.userName }); // Search for the given userName
        if (user === null) { // userName NOT found in 'users' collection
            console.log(`Login failed. used: ${req.body.userName}`);
            console.log("Fail with no matching userName");
            res.status(401).json({ message: "Invalid Credentials" });
        }
        else {
            const isCorrectPW = yield bcrypt_1.default.compare(req.body.password, user.password); // compare PW given with PW hash in DB
            // console.log("There is a matching userName")
            if (isCorrectPW) { // Password was a match!
                // *The first value passed into jwt.sign is the 'payload'. This can be retrieved in jwt.verify
                // console.log("There is a matching password")
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                const partialRT = refreshToken.substring(refreshToken.length - 8);
                console.log(`Login attempt successful by ${req.body.userName}`);
                console.log(`Setting cookie with refreshToken ending with ${partialRT}`);
                // TODO return a user object that has the password removed instead of the entire user from DB
                res
                    .status(201)
                    .cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: REFRESH_COOKIE_MAXAGE, sameSite: "none", secure: true })
                    .json({ msg: "Successful login", user: user, accessToken: accessToken });
            }
            else { // Password was NOT a match
                console.log("Fail with incorrect password");
                res.status(401).json({ message: "Invalid Credentials" });
            }
        }
    }
    catch (err) {
        res.status(400).json(err);
    }
});
// This is where an MANAGER can create a new INVITEE with NO permission
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
// A MANAGER or MEMBER can update their profile
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
// An INVITEE can become a MEMBER by registering
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.userName = req.body.userName.toLowerCase();
    try {
        const possibleUser = yield user_model_1.default.findOne({ userName: req.body.userName });
        if (possibleUser) {
            res.status(400).json({ errors: { userName: { message: 'This userName already exists. Please log in.' } } });
        }
        else {
            const newUser = yield user_model_1.default.create(req.body); // TODO Might be able to add .select('-password') to remove the password from 'newUser' in this line
            // *The first value passed into jwt.sign is the 'payload'. This can be retrieved in jwt.verify
            const accessToken = generateAccessToken(newUser);
            const refreshToken = generateRefreshToken(newUser);
            res
                .status(201)
                .cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: REFRESH_COOKIE_MAXAGE })
                .json({ msg: "Successful user registration", user: newUser, accessToken: accessToken });
        }
    }
    catch (err) {
        res.status(400).json(err);
    }
});
const logout = (req, res, next) => {
    console.log("Logout, clearing cookie.");
    res.clearCookie('refreshToken');
    res.sendStatus(200);
};
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = yield user_model_1.default.findOne({ _id: req.body.userId });
        if (currentUser !== null) {
            const accessToken = generateAccessToken(currentUser);
            console.log("Refreshing Access Token");
            res
                .status(201)
                .json({ msg: "Refreshed accessToken", user: currentUser, accessToken: accessToken });
        }
        else {
            console.error("Error attempting to refresh Access Token");
            throw "Error attempting to refresh Access Token";
        }
    }
    catch (err) {
        res.status(400).json(err);
    }
});
exports.default = { login, create, updateUser, register, logout, refreshToken };
/*

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const oneUser = await UserModel
    .findById({_id : req.params.id})
    res.status(200).json(oneUser);
  }
  catch (err){
    res.status(400).json(err);
  }
}

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    const currentUser = await UserModel.find({_id : req.body.userId})                         // req.body.userId will come through JWT token
    res.status(200).json(currentUser);
  }
  catch (err){
      res.status(400).json(err);
    }
  }

updateUser: async (req, res) => {
    try{
      const updatedUser = await User.findOneAndUpdate ({_id : req.body.userId}, req.body, {new:true, runValidators:true}); // req.body.userId coming through JWT
      res.status(200).json(updatedUser);
    }
    catch (err){
      res.status(400).json(err);
    }
  }
}
*/
/* Temporary, for development only
const createUser = (req: Request, res: Response, next: NextFunction) => {
  UserModel.create(req.body)
  .then(newUser => res.status(201).json(newUser))
  .catch(err => res.status(400).json(err))
}
*/
/* Temporary, for development only
const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
  UserModel.find({})
  .then(allUsers => res.status(200).json(allUsers))
  .catch(err => res.status(400).json(err))
}
*/
