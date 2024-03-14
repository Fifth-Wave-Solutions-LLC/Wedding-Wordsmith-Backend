import mongoose from 'mongoose';

import { IS_DEPLOYED } from '../../server';

/* LOCAL MONGO CONSTANTS */
const DB_NAME = "wedding_wordsmith";

/** DEPLOYED MONGO ATLAS CONSTANTS */
const MONGO_USERNAME = process.env.MONGO_USERNAME || ""
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ""
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@weddingwordsmith.vchrbdc.mongodb.net/appName=WeddingWordsmith`

/* LOCAL MONGO DB CONFIG */
async function connectLocal() {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`);  
        console.log(`Established a connection to local MongoDB. Database = ${DB_NAME}`)
    } catch (err) {
        console.log(`Error connecting to local MongDB`, err );
    }
}

/** DEPLOYED MONGO ATLAS CONFIG */
async function connectDeployed(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URL,  { retryWrites: true, w: 'majority'});  
    console.log(`Established a connection to MongoDB Atlas`)
  } catch (err) {
    console.log(`Error connecting to MongoDB Atlas`, err );
  }
}

if (IS_DEPLOYED) {
  connectDeployed();
} else {
  connectLocal();
}