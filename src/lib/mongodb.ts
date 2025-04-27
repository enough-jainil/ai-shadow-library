
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://aijobsaac:PASSWORD@cluster0.d8jtc.mongodb.net/?retryWrites=true&w=majority";
// Note: You should replace PASSWORD with your actual password and store this in a .env file

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    return client.db("ai_shadow_library");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  await client.close();
  console.log("MongoDB connection closed");
}

export default client;
