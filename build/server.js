"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.PORT = exports.IS_DEPLOYED = void 0;
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const article_routes_1 = __importDefault(require("./src/routes/article.routes"));
dotenv_1.default.config(); // loads environmental variables
exports.IS_DEPLOYED = process.env.IS_DEPLOYED !== "true" ? false : true;
exports.PORT = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 9090;
exports.SECRET = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET
};
const origins = [
    'http://localhost:5173',
    'http://weddingwordsmith.com',
    'https://weddingwordsmith.com',
    'http://www.weddingwordsmith.com',
    'https://www.weddingwordsmith.com',
    'http://wedding-ws.pro',
    'https://wedding-ws.pro',
    'http://api.wedding-ws.pro',
    'https://api.wedding-ws.pro',
    'http://www.wedding-ws.pro',
    'https://www.wedding-ws.pro'
];
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // has to do with bodyParser
app.use((0, cors_1.default)({ origin: origins, allowedHeaders: ['Content-Type', 'Authorization'], credentials: true }));
app.use((0, cookie_parser_1.default)());
require("./src/config/mongoose.config"); // start database connection here
/** Healthcheck route*/
app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
//** API routes */
app.use(user_routes_1.default);
app.use(article_routes_1.default);
app.listen(exports.PORT, () => console.log(`Express is listening on port: ${exports.PORT}`));
