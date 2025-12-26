// Import the Pinecone library
const { Pinecone } = require("@pinecone-database/pinecone");

// Initialize a Pinecone client with your API key, but allow running without it
let quickGptIndex = null;

try {
  if (process.env.PINECONE_API_KEY) {
    const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    quickGptIndex = pc.Index("quickgpt");
  } else {
    console.warn("Pinecone disabled: PINECONE_API_KEY is not set.");
  }
} catch (err) {
  console.error("Failed to initialize Pinecone client. Vector features disabled.", err);
  quickGptIndex = null;
}

async function createMemory({ vectors, metadata, messageId }) {
  if (!quickGptIndex) return; // gracefully no-op when Pinecone is unavailable

  try {
    await quickGptIndex.upsert([
      {
        id: messageId,
        values: vectors,
        metadata,
      },
    ]);
  } catch (err) {
    console.error("Pinecone upsert (createMemory) failed. Continuing without vector storage.", err);
  }
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  if (!quickGptIndex) return [];

  try {
    const data = await quickGptIndex.query({
      vector: queryVector,
      topK: limit,
      filter: metadata ? metadata : undefined,
      includeMetadata: true,
    });

    return data.matches || [];
  } catch (err) {
    console.error("Pinecone query (queryMemory) failed. Returning empty results.", err);
    return [];
  }
}

module.exports = { createMemory, queryMemory };
