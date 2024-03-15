"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.IS_DEPLOYED = void 0;
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config(); // loads environmental variables
exports.IS_DEPLOYED = process.env.IS_DEPLOYED !== "true" ? false : true;
exports.SECRET = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
};
const origins = [
    'http://localhost:5173',
    'http://weddingwordsmith.com',
    'https://weddingwordsmith.com',
    'http://api.weddingwordsmith.com',
    'https://api.weddingwordsmith.com',
    'http://www.weddingwordsmith.com',
    'https://www.weddingwordsmith.com'
];
const app = (0, express_1.default)();
const port = 8000; // Express port
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // has to do with bodyParser
app.use((0, cors_1.default)({ origin: origins, allowedHeaders: ['Content-Type', 'Authorization'], credentials: true }));
app.use((0, cookie_parser_1.default)());
require("./src/config/mongoose.config"); // start database connection here
/** Healthcheck route*/
app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
//** API routes */
app.use(user_routes_1.default);
app.listen(port, () => console.log(`Express is listening on port: ${port}`));
