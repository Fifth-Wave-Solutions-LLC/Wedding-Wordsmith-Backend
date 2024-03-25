import express from 'express'
import userRouter from './src/routes/user.routes'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import articleRouter from './src/routes/article.routes'
dotenv.config() // loads environmental variables

export const IS_DEPLOYED: boolean = process.env.IS_DEPLOYED !== "true" ? false : true

export const PORT: number = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 9090

export const SECRET = {
  ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET as string
}

const origins = [
  'http://localhost:5173',
  'http://weddingwordsmith.com', 
  'https://weddingwordsmith.com', 
  'http://www.weddingwordsmith.com', 
  'https://www.weddingwordsmith.com',
  'http://www.wedding-ws.pro', 
  'https://www.wedding-ws.pro',
  'http://wedding-ws.pro', 
  'https://wedding-ws.pro'
]

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true})); // has to do with bodyParser
app.use(cors({ origin: origins, allowedHeaders: ['Content-Type', 'Authorization'], credentials: true }))
app.use(cookieParser());

require("./src/config/mongoose.config"); // start database connection here

/** Healthcheck route*/
app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong'}))

//** API routes */
app.use(userRouter)
app.use(articleRouter)

app.listen(PORT, ()=> console.log(`Express is listening on port: ${PORT}`))
