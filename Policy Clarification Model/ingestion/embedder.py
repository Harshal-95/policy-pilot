import os
import uuid
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()

# -------------------------------
# Load Embedding Model
# -------------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

# Normalize embeddings for better cosine similarity
def generate_embeddings(texts):
    """
    Generate normalized embeddings for a list of texts.
    """
    return model.encode(
        texts,
        batch_size=32,
        show_progress_bar=True,
        normalize_embeddings=True
    ).tolist()


# -------------------------------
# Connect to Pinecone
# -------------------------------
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("policy-index")


# -------------------------------
# Upsert Multiple Chunks
# -------------------------------
def upsert_chunks(chunks):
    """
    Accepts output from chunk_documents()
    and stores embeddings in Pinecone.
    """

    texts = [chunk["content"] for chunk in chunks]

    embeddings = generate_embeddings(texts)

    vectors = []

    for chunk, embedding in zip(chunks, embeddings):

        vector_id = str(uuid.uuid4())  # unique ID

        metadata = {
            "page_number": chunk.get("page_number"),
            "type": chunk.get("type"),
            "text": chunk["content"]
        }

        # Only add table_id if it exists
        if "table_id" in chunk and chunk["table_id"] is not None:
            metadata["table_id"] = chunk["table_id"]

        vectors.append({
            "id": vector_id,
            "values": embedding,
            "metadata": metadata
        })

    # Batch upsert
    index.upsert(vectors=vectors)

    print(f"✅ Successfully upserted {len(vectors)} vectors to Pinecone.")
