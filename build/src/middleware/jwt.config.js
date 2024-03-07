"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRefresh = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // load environmental variables
let ACCESS_TOKEN_SECRET = "";
let REFRESH_TOKEN_SECRET = "";
if (process.env.DEPLOYED_STATUS) {
    ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; // For production/deployment
    REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET; // For production/deployment
}
else {
    REFRESH_TOKEN_SECRET = "secret_key"; // For development
    ACCESS_TOKEN_SECRET = "secret_key"; // For development
}
/* This file is our 'middleware'
  Every time our express server uses get, post, patch, etc.,
  we include the below function to *authenticate* the token that is
  in the cookie as part of the request coming from the front end.
  If authentication is successful, this function finishes with 'next()'
  which executes the .then() immediately following sending the request
  to the server
  */
const authenticate = (req, res, next) => {
    var _a;
    try {
        const payload = jsonwebtoken_1.default.verify((_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(" ")[1], ACCESS_TOKEN_SECRET);
        req.body.userId = payload._id;
        next();
    }
    catch (err) {
        console.log("Access token auth failed or expired within jwt.config.ts");
        res.status(403).json({ verified: false });
    }
};
exports.authenticate = authenticate;
/* This verifies the *refresh token* (when it is time update the access token)  */
const authenticateRefresh = (req, res, next) => {
    var _a;
    // console.log("req.cookies.refreshToken")
    // console.log(req.cookies.refreshToken)
    try {
        let partialRT = "No Cookie Present";
        if ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken) {
            partialRT = req.cookies.refreshToken.substring(req.cookies.refreshToken.length - 8);
        }
        console.log(`Attempting refresh of accessToken with refreshToken ending with: ${partialRT}`);
        // console.log("about to try jwt.verify")
        const payload = jsonwebtoken_1.default.verify(req.cookies.refreshToken, REFRESH_TOKEN_SECRET);
        // console.log("payload")
        // console.log(payload)
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
