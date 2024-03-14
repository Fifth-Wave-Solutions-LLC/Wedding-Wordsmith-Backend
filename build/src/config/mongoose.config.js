"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = require("../../server");
/* LOCAL MONGO CONSTANTS */
const DB_NAME = "wedding_wordsmith";
/** DEPLOYED MONGO ATLAS CONSTANTS */
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@weddingwordsmith.vchrbdc.mongodb.net/appName=WeddingWordsmith`;
/* LOCAL MONGO DB CONFIG */
function connectLocal() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`);
            console.log(`Established a connection to local MongoDB. Database = ${DB_NAME}`);
        }
        catch (err) {
            console.log(`Error connecting to local MongDB`, err);
        }
    });
}
/** DEPLOYED MONGO ATLAS CONFIG */
function connectDeployed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGO_URL, { retryWrites: true, w: 'majority' });
            console.log(`Established a connection to MongoDB Atlas`);
        }
        catch (err) {
            console.log(`Error connecting to MongoDB Atlas`, err);
        }
    });
}
if (server_1.IS_DEPLOYED) {
    connectDeployed();
}
else {
    connectLocal();
}
