import express from 'express'
import userRouter from './src/routes/user.routes'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config() // loads environmental variables

const app = express()
const port: number = 8000 // Express port

app.use(express.json());
app.use(express.urlencoded({extended:true})); // has to do with bodyParser
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({ origin: ['http://localhost:5173', 'http://api.weddingwordsmith.com', 'https://api.weddingwordsmith.com'], credentials: true }))
app.use(cookieParser());

require("./src/config/mongoose.config"); // start database connection here

app.use(userRouter)

app.listen(port, ()=> console.log(`Express is listening on port: ${port}`))
