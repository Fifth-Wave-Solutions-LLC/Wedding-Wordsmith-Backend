import { NextFunction, Request, Response }  from "express";
import jwt from 'jsonwebtoken'

import { SECRET } from '../../server';

interface UserPayload {
  _id: string
}

/* This file is our 'middleware' 
  Every time our express server uses get, post, patch, etc.,
  we include the below function to *authenticate* the token that is
  in the cookie as part of the request coming from the front end.
  If authentication is successful, this function finishes with 'next()'
  which executes the .then() immediately following sending the request
  to the server
  */
const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const payload = jwt.verify(req.headers['authorization']?.split(" ")[1] as string, SECRET.ACCESS_TOKEN_SECRET) as UserPayload
    req.body.userId = payload._id
    next();
  } catch (err) {
    console.log("Access token auth failed or expired within jwt.config.ts")
    res.status(403).json({ verified: false });
  }
};

/* This verifies the *refresh token* (when it is time update the access token)  */
const authenticateRefresh = (req: Request, res: Response, next: NextFunction): void => { // Refresh token is received in httpOnly cookie that comes with every axios request where { credentials: true }
  // console.log("req.cookies.refreshToken")
  // console.log(req.cookies.refreshToken)
  try {
    let partialRT = "No Cookie Present"
    if (req?.cookies?.refreshToken) {
      partialRT = req.cookies.refreshToken.substring(req.cookies.refreshToken.length-8)  
    }
    console.log(`Attempting refresh of accessToken with refreshToken ending with: ${partialRT}`)
    // console.log("about to try jwt.verify")
    const payload = jwt.verify(req.cookies.refreshToken, SECRET.REFRESH_TOKEN_SECRET) as UserPayload
    // console.log("payload")
    // console.log(payload)
    req.body.userId = payload._id
    next();

  } catch (err){
    console.log("Refresh token auth failed or expired within jwt.config.ts")
    console.error(err)
    res.status(403).json({ verified: false });
  }
}

export { authenticate, authenticateRefresh }