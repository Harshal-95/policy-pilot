CREATE TABLE policy_documents (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policy_chunks (
    id SERIAL PRIMARY KEY,
    document_id INT REFERENCES policy_documents(id),
    chunk_text TEXT,
    page_no INT,
    section TEXT
);

CREATE TABLE user_queries (
    id SERIAL PRIMARY KEY,
    question TEXT,
    asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE query_results (
    id SERIAL PRIMARY KEY,
    query_id INT REFERENCES user_queries(id),
    chunk_id INT REFERENCES policy_chunks(id),
    confidence FLOAT
);

