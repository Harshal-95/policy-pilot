# PolicyPilot  
### Enterprise AI-Powered Policy Intelligence System  

PolicyPilot is a full-stack AI application that enables intelligent querying and analysis of policy documents using **Retrieval-Augmented Generation (RAG)**.

It allows users to upload policy PDFs and ask contextual questions. The system retrieves relevant document sections using semantic vector search and generates grounded, enterprise-grade responses using a local LLM.

---

## 🚀 Core Idea

Policy documents are often long, complex, and difficult to navigate.

PolicyPilot solves this problem by:

- Converting policy PDFs into structured text chunks  
- Generating embeddings for semantic understanding  
- Storing embeddings in a vector database  
- Retrieving top relevant sections for a query  
- Generating factual answers using a local LLM  
- Enforcing a strict **no-hallucination, context-only policy**

---

## 🏗️ Architecture Overview

User
↓
React Frontend (Vite)
↓
Flask Backend API
↓
Document Ingestion & Chunking
↓
Sentence Transformers (Embeddings)
↓
Pinecone Vector Database
↓
Top-K Retrieval
↓
Ollama Runtime + Mistral 7B
↓
Enterprise-Grade Response


This system follows a **retrieval-first architecture** to ensure responses are grounded strictly in uploaded document content.

---

## 🧠 Tech Stack

### 🔹 Frontend
- React (Vite)
- Modern SaaS-style Dashboard UI
- Dark / Light Mode
- Multi-conversation Chat System
- AI Thinking Animation

### 🔹 Backend
- Flask (Python)
- REST APIs
- Flask-CORS
- Python-Dotenv

### 🔹 AI / RAG Stack
- Sentence Transformers (`all-MiniLM-L6-v2`)
- Pinecone (Vector Database)
- Ollama (Local LLM Runtime)
- Mistral 7B (LLM Model)
- Custom Prompt Engineering

### 🔹 Databases
- PostgreSQL (Metadata & Conversation Storage – extendable)
- Pinecone (Semantic Vector Search)

---

## ⚙️ How It Works

### 1️⃣ Document Upload
- User uploads a policy PDF  
- Backend extracts text and tables  
- Content is split into structured chunks  
- Metadata (e.g., page numbers) is preserved  

### 2️⃣ Chunking & Embedding
- Each chunk is converted into a vector embedding  
- Stored in Pinecone for semantic similarity search  

### 3️⃣ Question Answering
- User question is embedded  
- Pinecone retrieves top-K relevant chunks  
- Retrieved context is passed to Mistral (via Ollama)  
- LLM generates a grounded response  

### 4️⃣ Safe Enterprise Responses
- Answers strictly based on retrieved context  
- No hallucination or external assumptions  
- If information is missing, system responds professionally  

## 💬 Conversation System
 
- Dynamic conversation switching  
- Auto-generated conversation titles  
- In-memory session storage (extendable to PostgreSQL)  
- Recent conversations sidebar  

---

## 🎨 UI Features

- Professional dashboard layout  
- Scrollable sidebar  
- Dynamic document list  
- Multi-session chat  
- Auto-scroll to latest message  
- Dark / Light theme toggle  

---

## 📂 Project Structure

policy-pilot/
│
├── Policy Clarification Model/ # Flask Backend
│ ├── app.py
│ ├── ingestion/
│ ├── rag/
│ ├── db/
│ ├── requirements.txt
│ └── .env (not committed)
│
├── policy-ui/ # React Frontend
│ ├── components/
│ ├── layout/
│ └── styles/
│
└── .gitignore


---

## 🛠️ Setup Instructions

### 🔹 Backend Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
Create a .env file:

PINECONE_API_KEY=your_key_here
PINECONE_INDEX=policy-index
Run backend:

python app.py
🔹 Frontend Setup
cd policy-ui
npm install
npm run dev
🔹 Ollama + Mistral Setup
Install Ollama:
https://ollama.com

Pull model:

ollama pull mistral
Run model:

ollama serve
🧭 Design Principles
Retrieval-first architecture

Zero hallucination policy

Context-only answering

Modular & scalable backend design

Enterprise-grade response tone

🎯 Ideal Use Cases
Insurance companies

Legal & compliance teams

Corporate policy management
