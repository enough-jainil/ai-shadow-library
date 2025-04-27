
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://aijobsaac:aijobsaac@cluster0.d8jtc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    return client.db("ai_shadow_library");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  try {
    await client.close();
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

export default client;
