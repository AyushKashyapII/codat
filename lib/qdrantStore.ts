import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantClient } from '@qdrant/js-client-rest';

if (!process.env.GOOGLE_API_KEY || !process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
    throw new Error('Required environment variables are not defined');
  }
  
  
  const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });
  
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "text-embedding-004",
  });

const ensureCollection = async (
collectionName: string,
vectorSize: number
): Promise<void> => {
if (!collectionName || !vectorSize) {
    throw new Error('Collection name and vector size are required');
}

const maxRetries = 3;
let currentTry = 0;

while (currentTry < maxRetries) {
    try {
    try {
        const collection = await qdrantClient.getCollection(collectionName);
        console.log(`Collection ${collectionName} exists with config:`, collection);
        
        // Validate vector size matches
        if (!collection.config.params.vectors || collection.config.params.vectors.size === undefined || collection.config.params.vectors.size !== vectorSize) {
        throw new Error(`Vector size mismatch. Expected: ${vectorSize}, Got: ${collection.config.params.vectors?.size}`);
        }
        return;
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        if (error.status !== 404) {
        throw error;
        }
    }

    const collectionConfig = {
        vectors: {
        size: vectorSize,
        distance: 'Cosine' as const,
        },
        optimizers_config: {
        default_segment_number: 2,
        },
        replication_factor: 2,
        write_consistency_factor: 1, 
    };

    await qdrantClient.createCollection(collectionName, collectionConfig);
    console.log(`Created new collection: ${collectionName}`);
    
    // Validate collection was created
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait longer
    const newCollection = await qdrantClient.getCollection(collectionName);
    
    if (!newCollection) {
        throw new Error('Collection creation verification failed');
    }
    
    return;
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
    currentTry++;
    console.error(`Attempt ${currentTry}/${maxRetries} failed:`, error);
    
    if (currentTry === maxRetries) {
        throw new Error(`Collection creation failed after ${maxRetries} attempts: ${error.message || 'Unknown error'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, Math.pow(2, currentTry) * 1000));
    }
}
};

const validateQdrantConnection = async (): Promise<void> => {
try {
    await qdrantClient.getCollections();
} 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
catch (error: any) {
    throw new Error(`Failed to connect to Qdrant: ${error.message || 'Unknown error'}`);
}
};

const createVectorStore = async (
text: string,
collectionName: string
): Promise<void> => {
// Validate inputs
if (!text?.trim()) {
    throw new Error('No text provided for vector store creation');
}

await validateQdrantConnection();

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const documentTexts = await textSplitter.splitText(text);

if (!documentTexts.length) {
    throw new Error('No text chunks generated');
}

const embeds = await Promise.all(
    documentTexts.map(text => embeddings.embedQuery(text))
);

if (!embeds.length || !embeds[0].length) {
    throw new Error('Failed to generate embeddings');
}

await ensureCollection(collectionName, embeds[0].length);

const points = documentTexts.map((text, i) => ({
    id: Date.now() + i, 
    vector: Array.from(embeds[i]),
    payload: { 
    text: text.trim(),
    timestamp: new Date().toISOString(),
    chunkIndex: i
    }
}));

const batchSize = 10; 
for (let i = 0; i < points.length; i += batchSize) {
    const batch = points.slice(i, i + batchSize);
    let retries = 3;
    while (retries > 0) {
    try {
        await qdrantClient.upsert(collectionName, {
        points: batch,
        wait: true
        });
        console.log(`Successfully uploaded batch ${i/batchSize + 1}/${Math.ceil(points.length/batchSize)}`);
        break;
    } catch (error) {
        retries--;
        console.error(`Batch upload failed, ${retries} retries left:`, error);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    }
}
};

export async function qdrantStore(code : string, language : string, userName: string, codatId: number): Promise<void> {
    if(!code || !language) {
        throw new Error('Invalid request');
    }
    const text = "The id of this codat below is " + codatId + "\n" + " and the code is \n" + code + "THIS IS WHERE PREVIOUS CODAT ENDS AND NEW ONE STARTS \n\n";
    await createVectorStore(text, userName);
  }