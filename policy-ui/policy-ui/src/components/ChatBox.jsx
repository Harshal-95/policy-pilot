import React, { useState, useRef } from "react";
import axios from "axios";
import Message from "./Message";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // 📄 Handle File Upload
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://127.0.0.1:5000/upload_policy", formData);
      alert("Document uploaded successfully ✅");
    } catch (err) {
      alert("Upload failed ❌");
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/ask", {
        question
      });

      const botMessage = {
        role: "bot",
        text: res.data.answer,
        page_number: res.data.page_number
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Error connecting to server." }
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <div className="chat-container">

      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}

        {loading && (
          <div className="typing">
            <span></span><span></span><span></span>
          </div>
        )}
      </div>

      <div className="input-wrapper">
        <button
          className="plus-btn"
          onClick={() => fileInputRef.current.click()}
        >
          +
        </button>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />

        <input
          type="text"
          placeholder="Ask anything about the policy..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askQuestion()}
        />

        <button className="ask-btn" onClick={askQuestion}>
          Ask
        </button>
      </div>
    </div>
  );
}
