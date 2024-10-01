import { Pinecone } from "@pinecone-database/pinecone";

//this is pinecone config to index the database for use with the chatbot
//this is not used anymore, but is here incase we need it again

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
  throw new Error("Pinecone API key is missing");
}

const pinecone = new Pinecone({
  apiKey,
});

export const ProjectInfo = pinecone.Index("mgl-chatbot");
