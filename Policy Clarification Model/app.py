from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from dotenv import load_dotenv
from pinecone import Pinecone
from flask import Response
import json
# Ingestion
from ingestion.pdf_loader import extract_content_from_pdf
from ingestion.chunker import chunk_documents
from ingestion.embedder import upsert_chunks

# RAG
from rag.retriever import retrieve_context
from rag.generator import generate_answer

load_dotenv()
print("PINECONE KEY:", os.getenv("PINECONE_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY")) 
index = pc.Index("policy-index")
print("Indexes:", pc.list_indexes())
# ------------------------------------
# Configuration
# ------------------------------------
uploaded_documents = []
UPLOAD_FOLDER = "uploads"

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# ------------------------------------
# Routes
# ------------------------------------

@app.route("/")
def home():
    return "Smart Policy Clarification System Running"

# ------------------------------------
# Sidebar update
# ------------------------------------
@app.route("/documents", methods=["GET"])
def get_documents():
    return jsonify(uploaded_documents)

# ------------------------------------
# Upload Policy
# ------------------------------------

@app.route("/upload_policy", methods=["POST"])
def upload_policy():

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(file_path)

    try:
        raw_content = extract_content_from_pdf(file_path)
        chunks = chunk_documents(raw_content)
        upsert_chunks(chunks)

        #  STORE DOCUMENT INFO
        uploaded_documents.append({
            "id": len(uploaded_documents) + 1,
            "filename": file.filename,
            "status": "Indexed"
        })

        return jsonify({
            "message": "Policy uploaded and indexed successfully",
            "total_chunks": len(chunks)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ------------------------------------
# Ask Question
# ------------------------------------

@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()
    question = data.get("question")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        # 1️⃣ Retrieve relevant chunks
        matches = retrieve_context(question, top_k=10, score_threshold=0)

        print("Retrieved Matches:")
        for m in matches:
            print("Score:", m["score"])
            print("Text:", m["metadata"]["text"])
            print("------")


        if not matches:
            return jsonify({
                "question": question,
                "answer": "Not mentioned in the document.",
                "confidence": 0
            })

        # 2️⃣ Generate answer using LLM
        answer = generate_answer(matches, question)

        # 3️⃣ Confidence score (average similarity)
        scores = [match.get("score", 0) for match in matches]
        confidence = round(sum(scores) / len(scores), 3) if scores else 0

        # 4️⃣ Collect source pages
        source_pages = list({
            match["metadata"].get("page_number")
            for match in matches
        })

        return jsonify({
            "question": question,
            "answer": answer,
            "source_pages": source_pages,
            "confidence": confidence
        })

    except Exception as e:
        return jsonify({
            "error": f"Query failed: {str(e)}"
        }), 500


# ------------------------------------
# Run App
# ------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
