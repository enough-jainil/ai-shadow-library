
// This is a browser-compatible MongoDB client implementation
// For production, you should use a backend API instead of direct MongoDB access from the browser

// Mock client for browser environments
const mockClient = {
  db: (name: string) => ({
    collection: (collectionName: string) => ({
      findOne: async () => null,
      find: () => ({ toArray: async () => [] }), // Return an object with toArray method directly
      insertOne: async () => ({ acknowledged: true, insertedId: "mock-id" }),
      deleteOne: async () => ({ deletedCount: 1 }),
      updateOne: async () => ({ modifiedCount: 1 }),
    }),
  }),
  connect: async () => {},
  close: async () => {},
};

// Export mock DB functionality
export async function connectToDatabase() {
  console.log("Using mock MongoDB client for browser environment");
  return mockClient.db("ai_shadow_library");
}

export async function closeDatabaseConnection() {
  console.log("Mock MongoDB connection closed");
}

export default mockClient;
