import pdfplumber


def chunk_text(text, chunk_size=500, overlap=100):
    """
    Chunk normal paragraph text with overlap.
    """
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks


def table_to_semantic_chunks(table, page_number, table_id, rows_per_chunk=5):
    """
    Convert table into structured semantic chunks.
    """
    chunks = []

    if not table or len(table) < 2:
        return chunks

    headers = table[0]
    data_rows = table[1:]

    structured_rows = []

    for row in data_rows:
        # Skip empty rows
        if not any(row):
            continue

        row_text = ", ".join(
            f"{headers[i]}: {row[i]}" if i < len(row) and row[i] else f"{headers[i]}: "
            for i in range(len(headers))
        )

        structured_rows.append(row_text)

    # Combine rows into chunks
    for i in range(0, len(structured_rows), rows_per_chunk):
        combined_text = "\n".join(structured_rows[i:i + rows_per_chunk])

        chunks.append({
            "page_number": page_number,
            "content": combined_text,
            "type": "table",
            "table_id": table_id
        })

    return chunks


def extract_content_from_pdf(pdf_path):
    """
    Extract text and tables from PDF,
    convert them into embedding-ready chunks.
    """
    all_chunks = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_index, page in enumerate(pdf.pages):
            page_number = page_index + 1

            # -------- Extract Normal Text --------
            text = page.extract_text()
            if text:
                text_chunks = chunk_text(text)

                for chunk in text_chunks:
                    all_chunks.append({
                        "page_number": page_number,
                        "content": chunk,
                        "type": "text"
                    })

            # -------- Extract Tables --------
            tables = page.extract_tables()

            for table_id, table in enumerate(tables):
                table_chunks = table_to_semantic_chunks(
                    table,
                    page_number,
                    table_id
                )

                all_chunks.extend(table_chunks)

    return all_chunks
