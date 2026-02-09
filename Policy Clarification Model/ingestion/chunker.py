def chunk_plain_text(text, chunk_size=800, overlap=150):
    """
    Chunk normal paragraph text with overlap.
    """
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks


def chunk_documents(extracted_content, chunk_size=800, overlap=150):
    """
    Accepts structured output from extract_content_from_pdf()
    and returns embedding-ready chunks with metadata preserved.
    """

    final_chunks = []

    for item in extracted_content:
        content = item["content"]
        page_number = item.get("page_number")
        content_type = item.get("type")

        # -------- If it's normal text --------
        if content_type == "text":
            text_chunks = chunk_plain_text(content, chunk_size, overlap)

            for chunk in text_chunks:
                final_chunks.append({
                    "content": chunk,
                    "page_number": page_number,
                    "type": "text"
                })

        # -------- If it's table --------
        elif content_type == "table":
            # Table chunks are already semantically structured.
            # Do NOT re-chunk blindly (important for retrieval quality).
            final_chunks.append({
                "content": content,
                "page_number": page_number,
                "type": "table",
                "table_id": item.get("table_id")
            })

        else:
            # fallback safety
            final_chunks.append(item)

    return final_chunks
