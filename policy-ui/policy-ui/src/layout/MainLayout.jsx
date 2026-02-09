import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatArea from "../components/ChatArea";
import AskBar from "../components/AskBar";

export default function MainLayout() {

  const [theme, setTheme] = useState("dark");
  const [documents, setDocuments] = useState([]);

  const [conversations, setConversations] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // ==============================
  // THEME
  // ==============================
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ==============================
  // FETCH DOCUMENTS
  // ==============================
  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/documents");
      setDocuments(res.data);

      if (!selectedDocument && res.data.length > 0) {
        setSelectedDocument(res.data[0]);
      }

    } catch (err) {
      console.error("Error fetching documents");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ==============================
  // CREATE NEW CHAT
  // ==============================
  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Conversation",
      messages: []
    };

    setConversations(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  // ==============================
  // SELECT CHAT
  // ==============================
  const handleSelectChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
  };

  // ==============================
  // HANDLE ASK
  // ==============================
  const handleAsk = async (question) => {
    if (!question.trim() || loading) return;

    const userMessage = { role: "user", text: question };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/ask",
        { question }
      );

      const botMessage = {
        role: "bot",
        text: res.data.answer,
        pages: res.data.source_pages
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Save conversation
      setConversations(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? {
                ...chat,
                title: chat.title === "New Conversation"
                  ? question.slice(0, 40)
                  : chat.title,
                messages: finalMessages
              }
            : chat
        )
      );

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "bot", text: "Error generating response." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        theme={theme}
        setTheme={setTheme}
        documents={documents}
        conversations={conversations}
        onSelectDocument={setSelectedDocument}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
      />

      <div className="main-section">
        <Header selectedDocument={selectedDocument} />

        <ChatArea
          messages={messages}
          loading={loading}
        />

        <AskBar
          onUploadSuccess={fetchDocuments}
          onAsk={handleAsk}
          loading={loading}
        />
      </div>
    </div>
  );
}
