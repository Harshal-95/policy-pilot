import os
from pinecone import Pinecone
from ingestion.embedder import generate_embeddings
from dotenv import load_dotenv

load_dotenv()

# -------------------------------
# Connect to Pinecone
# -------------------------------
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("policy-index")


def retrieve_context(question, top_k=8, score_threshold=0.2):
    """
    Takes user question,
    returns Pinecone matches directly (for generator).
    """

    # Generate normalized query embedding
    query_embedding = generate_embeddings([question])[0]

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )

    matches = results.get("matches", [])

    # Filter low-quality matches
    filtered_matches = [
        match for match in matches
        if match.get("score", 0) >= score_threshold
    ]

    return filtered_matches
