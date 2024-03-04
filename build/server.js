"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("./src/routes/user.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config(); // loads environmental variables
const app = (0, express_1.default)();
const port = 8000; // Express port
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // has to do with bodyParser
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use((0, cors_1.default)({ origin: ['http://localhost:5173', 'http://api.weddingwordsmith.com', 'https://api.weddingwordsmith.com', 'http://www.weddingws.com', 'http://weddingws.com', 'https://www.weddingws.com', 'https://weddingws.com'], credentials: true }));
app.use((0, cookie_parser_1.default)());
require("./src/config/mongoose.config"); // start database connection here
app.use(user_routes_1.default);
app.listen(port, () => console.log(`Express is listening on port: ${port}`));
