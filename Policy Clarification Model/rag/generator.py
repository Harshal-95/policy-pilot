import requests


def build_context(matches, max_chunks=10):
    """
    Extract text from Pinecone matches and
    format context with page references.
    """

    context_parts = []

    for match in matches[:max_chunks]:
        metadata = match.get("metadata", {})
        text = metadata.get("text", "")
        page = metadata.get("page_number", "Unknown")

        formatted = f"[Page {page}]\n{text}"
        context_parts.append(formatted)

    return "\n\n".join(context_parts)


def generate_answer(matches, question):
    """
    Accepts Pinecone query matches directly.
    """

    context_text = build_context(matches)

    prompt = f"""
You are an enterprise-grade Policy Intelligence Assistant.

Your role is to provide clear, factual, and professional answers strictly based on the provided document context.

INSTRUCTIONS:

1. Answer ONLY using the provided context.
2. Do NOT use external knowledge.
3. Do NOT hallucinate or assume facts not present in the context.
4. If the answer is clearly supported in the context, provide a precise and structured response.
5. If the information is not explicitly mentioned in the document:
   - Infer safely based on absence of evidence.
   - Respond professionally.
   - Example:
       Instead of saying "Not mentioned in the document",
       say something like:
       "Based on the available document content, there is no indication that any policyholder has a pre-existing disease."
6. Never fabricate details.
7. Maintain a formal, professional, enterprise tone.
8. Keep answers concise but complete.
9. If the question requires a yes/no:
   - If evidence exists → answer clearly.
   - If no evidence exists → respond as:
       "There is no information in the document indicating that..."
10. Avoid conversational fillers.

Your goal is to behave like a professional policy analyst, not a chatbot.

Context:
{context_text}

Question:
{question}

Answer:
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "mistral",
                "prompt": prompt,
                "stream": False,
                "temperature": 0.2
            },
            timeout=60
        )

        response.raise_for_status()
        return response.json().get("response", "Error generating answer.")

    except requests.exceptions.RequestException as e:
        return f"LLM request failed: {str(e)}"
