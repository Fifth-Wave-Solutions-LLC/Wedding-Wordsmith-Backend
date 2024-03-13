import express from 'express'
import userRouter from './src/routes/user.routes'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config() // loads environmental variables

const origins = [
  'http://localhost:5173',
  'http://weddingwordsmith.com', 
  'https://weddingwordsmith.com', 
  'http://api.weddingwordsmith.com', 
  'https://api.weddingwordsmith.com', 
  'http://www.weddingwordsmith.com', 
  'https://www.weddingwordsmith.com'
]

const app = express()
const port: number = 8000 // Express port

app.use(express.json());
app.use(express.urlencoded({extended:true})); // has to do with bodyParser
app.use(cors({ origin: origins, allowedHeaders: ['Content-Type', 'Authorization'], credentials: true }))
app.use(cookieParser());

require("./src/config/mongoose.config"); // start database connection here

app.use(userRouter)

app.listen(port, ()=> console.log(`Express is listening on port: ${port}`))
