"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRefresh = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../../server");
/* This file is our 'middleware'
  Every time our express server uses get, post, patch, etc.,
  we include the below function to *authenticate* the token that is
  in the cookie as part of the request coming from the front end.
  If authentication is successful, this function finishes with 'next()'
  which executes the .then() immediately following sending the request
  to the server
  */
// TODO authenticate should reject requests if the user's account is expired
const authenticate = (req, res, next) => {
    var _a;
    try {
        const payload = jsonwebtoken_1.default.verify((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(" ")[1], server_1.SECRET.ACCESS_TOKEN_SECRET);
        // console.log("payload")
        // console.log(payload)
        req.body.userId = payload._id;
        next();
    }
    catch (err) {
        console.log("Authenticate failed within jwt.config.ts");
        res.status(403).json({ verified: false });
    }
};
exports.authenticate = authenticate;
/* This verifies the *refresh token* (when it is time update the access token)  */
const authenticateRefresh = (req, res, next) => {
    var _a;
    try {
        let partialRT = "No Cookie Present";
        if ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) {
            partialRT = req.cookies.refreshToken.substring(req.cookies.refreshToken.length - 8);
        }
        console.log(`Attempting refresh of accessToken with refreshToken ending with: ${partialRT}`);
        const payload = jsonwebtoken_1.default.verify(req.cookies.refreshToken, server_1.SECRET.REFRESH_TOKEN_SECRET);
        req.body.userId = payload._id;
        next();
    }
    catch (err) {
        console.log("Refresh token auth failed or expired within jwt.config.ts");
        console.error(err);
        res.status(403).json({ verified: false });
    }
};
exports.authenticateRefresh = authenticateRefresh;
