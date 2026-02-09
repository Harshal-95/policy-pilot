import React, { useState } from "react";
import axios from "axios";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/upload_policy",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      setStatus(
        `Uploaded successfully! Document ID: ${res.data.document_id}`
      );
    } catch (err) {
      setStatus("Upload failed.");
    }
  };

  return (
    <div className="upload-box">
      <h3>Upload Policy PDF</h3>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>Upload</button>

      <div className="upload-status">{status}</div>
    </div>
  );
}
