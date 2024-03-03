import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config()

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

const MONGO_USERNAME = process.env.MONGO_USERNAME || ""
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ""
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.zdfumif.mongodb.net/appName=Cluster0`


async function connect() {
  try {
    await mongoose.connect(MONGO_URL,  { retryWrites: true, w: 'majority'});  
    console.log(`Established a connection to MongoDB Atlas`)
  } catch (err) {
    console.log(`Error connecting to MongoDB`, err );
  }
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
