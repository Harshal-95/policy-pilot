import { useRef, useState } from "react";
import axios from "axios";

export default function AskBar({ onUploadSuccess, onAsk, loading }) {
  const fileInputRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [uploading, setUploading] = useState(false);

  // -----------------------------
  // Handle File Upload
  // -----------------------------
  const handlePlusClick = () => {
    if (!uploading && !loading) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      await axios.post(
        "http://127.0.0.1:5000/upload_policy",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (onUploadSuccess) {
        await onUploadSuccess();
      }

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  };

  // -----------------------------
  // Handle Ask Question
  // -----------------------------
  const handleAsk = () => {
    if (!question.trim() || loading || uploading) return;

    if (onAsk) {
      onAsk(question);
    }

    setQuestion("");
  };

  return (
    <div className="ask-container">

      {/* PLUS BUTTON */}
      <button
        className="plus-btn"
        onClick={handlePlusClick}
        disabled={uploading || loading}
      >
        {uploading ? "..." : "+"}
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".pdf"
      />

      {/* QUESTION INPUT */}
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        placeholder={
          loading
            ? "Generating answer..."
            : uploading
            ? "Uploading document..."
            : "Ask anything about the policy..."
        }
        disabled={loading || uploading}
      />

      {/* ASK BUTTON */}
      <button
        className="ask-btn"
        onClick={handleAsk}
        disabled={loading || uploading || !question.trim()}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

    </div>
  );
}
