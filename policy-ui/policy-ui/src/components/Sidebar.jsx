import {
  MessageSquare,
  FileText,
  Sun,
  Settings,
  Sparkles,
  Clock
} from "lucide-react";

export default function Sidebar({
  theme,
  setTheme,
  documents,
  conversations,
  onSelectDocument,
  onNewChat,
  onSelectChat,
  currentChatId
}) {
  return (
    <div className="sidebar">

      {/* LOGO */}
      <div className="logo-section">
        <div className="logo-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <h2>PolicyPilot</h2>
          <span>AI Document Intelligence</span>
        </div>
      </div>

      {/* NEW CHAT */}
      <button
        className="new-chat-btn"
        onClick={onNewChat}
      >
        + New Conversation
      </button>

      {/* RECENT CONVERSATIONS */}
      <div className="section">
        <p className="section-title">
          <MessageSquare size={14} /> RECENT CONVERSATIONS
        </p>

        {conversations.length > 0 ? (
          conversations.map((chat) => (
            <div
              key={chat.id}
              className={`menu-item ${currentChatId === chat.id ? "active" : ""}`}
              onClick={() => onSelectChat(chat)}
            >
              <MessageSquare size={16} />
              <div className="menu-item-content">
                <span>{chat.title}</span>
                <small>
                  <Clock size={12} /> Saved
                </small>
              </div>
            </div>
          ))
        ) : (
          <small style={{ color: "#64748b" }}>
            No conversations yet
          </small>
        )}
      </div>

      {/* DOCUMENTS */}
      <div className="section">
        <p className="section-title">
          <FileText size={14} /> UPLOADED DOCUMENTS
        </p>

        {documents.map((doc) => (
          <div
            key={doc.id}
            className="uploaded-doc"
            onClick={() => onSelectDocument(doc)}
            style={{ cursor: "pointer" }}
          >
            <FileText size={16} />
            <div className="uploaded-doc-content">
              <span>{doc.filename}</span>
              <small className="status-green">
                {doc.status}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="bottom-menu">
        <div
          className="bottom-item"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun size={16} />
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </div>

        <div className="bottom-item">
          <Settings size={16} />
          Settings
        </div>
      </div>
    </div>
  );
}
