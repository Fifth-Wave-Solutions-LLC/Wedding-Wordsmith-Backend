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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* LOCAL MONGO CONFIG
const DBNAME = "wedding_wordsmith";

async function connect() {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/${DBNAME}`);
        console.log(`Established a connection to the MongoDB. Database = ${DBNAME}`)
    } catch (err) {
        console.log(`Error connecting to MongDB`, err );
    }
}
connect();
 END LOCAL MONGO CONFIG */
/** DEPLOYED MONGO ATLAS CONFIG */
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.zdfumif.mongodb.net/appName=Cluster0`;
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGO_URL, { retryWrites: true, w: 'majority' });
            console.log(`Established a connection to MongoDB Atlas`);
        }
        catch (err) {
            console.log(`Error connecting to MongoDB`, err);
        }
    });
}
connect();
// const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337 // MongoDB port - if local / Not Cloud ?
// const config = {
//   mongo: {
//     url: MONGO_URL
//   },
//   server: {
//     port: SERVER_PORT 
//   }
// }
