import { NextFunction, Request, Response } from "express";
import UserModel, { IUser } from "../models/user.model";
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { SECRET } from '../../server';

const ACCESS_TOKEN_DURATION: string = '7d' // TODO reduce this once cookies are working
const REFRESH_TOKEN_DURATION: string = '60d'
const REFRESH_COOKIE_MAXAGE: number = 60*24*60*60*1000

function generateAccessToken(user: IUser): string {
  const accessToken = jwt.sign({ _id : user._id }, SECRET.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_DURATION });
  return accessToken;
}
function generateRefreshToken(user: IUser): string {
  const refreshToken = jwt.sign({ _id : user._id }, SECRET.REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_DURATION}); 
  return refreshToken;
}

const login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(`Login attempt by ${req.body.userName}`)
  req.body.userName = req.body.userName.toLowerCase()
  console.log(`Login string used: ${req.body.userName}`)
  try {
    const user = await UserModel.findOne({ userName: req.body.userName });     // Search for the given userName
    if (user === null) {                                            // userName NOT found in 'users' collection
      console.log(`Login failed. used: ${req.body.userName}`)
      console.log("Fail with no matching userName")
      res.status(401).json({message:"Invalid Credentials"});
    } else {
      const isCorrectPW = await bcrypt.compare(req.body.password, user.password); // compare PW given with PW hash in DB
      // console.log("There is a matching userName")
      if(isCorrectPW) {                                             // Password was a match!
        // *The first value passed into jwt.sign is the 'payload'. This can be retrieved in jwt.verify
        // console.log("There is a matching password")
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const partialRT = refreshToken.substring(refreshToken.length-8)  
        console.log(`Login attempt successful by ${req.body.userName}`)
        console.log(`Setting cookie with refreshToken ending with ${partialRT}`)
        // TODO return a user object that has the password removed instead of the entire user from DB
        res
          .status(201)
          .cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: REFRESH_COOKIE_MAXAGE, sameSite: "none", secure: true })
          .json({msg: "Successful login", user : user, accessToken : accessToken})
      } else {                                                      // Password was NOT a match
        console.log("Fail with incorrect password")
        res.status(401).json({message:"Invalid Credentials"});
      }
    }
  }
  catch(err){
    res.status(400).json(err);
  }
}

// This is where an MANAGER can create a new INVITEE with NO permission
const create = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
}

// A MANAGER or MEMBER can update their profile
const updateUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
}

// An INVITEE can become a MEMBER by registering
const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  req.body.userName = req.body.userName.toLowerCase()
  try {
    const possibleUser = await UserModel.findOne({ userName : req.body.userName })
    if (possibleUser) {
      res.status(400).json({errors: { userName : { message : 'This userName already exists. Please log in.' }}})
    } else {
      const newUser = await UserModel.create(req.body) // TODO Might be able to add .select('-password') to remove the password from 'newUser' in this line
      // *The first value passed into jwt.sign is the 'payload'. This can be retrieved in jwt.verify
      const accessToken = generateAccessToken(newUser);
      const refreshToken = generateRefreshToken(newUser);  
      res
        .status(201)
        .cookie("refreshToken", refreshToken, { httpOnly: true, maxAge : REFRESH_COOKIE_MAXAGE}) 
        .json({msg: "Successful user registration", user : newUser, accessToken : accessToken})
      }
  }
  catch(err) {
    res.status(400).json(err)
  }
}

const logout = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Logout, clearing cookie.")
  res.clearCookie('refreshToken')
  res.sendStatus(200)
}

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUser = await UserModel.findOne({_id : req.body.userId});
    if(currentUser !== null ){
      const accessToken = generateAccessToken(currentUser);
      console.log("Refreshing Access Token")
      res
      .status(201)
      .json({msg: "Refreshed accessToken", user : currentUser, accessToken : accessToken })
    } else {
      console.error("Error attempting to refresh Access Token")
      throw "Error attempting to refresh Access Token"
    }
  } catch(err) {
    res.status(400).json(err)
  }
}

export default { login, create, updateUser, register, logout, refreshToken }  


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
