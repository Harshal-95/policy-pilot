import { useEffect, useRef } from "react";

export default function ChatArea({ messages, loading }) {
  const bottomRef = useRef(null);

  // Auto scroll to bottom when messages update or loading changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-wrapper">
      <div className="chat-area">

        {/* Render Messages */}
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.role}`}>
            <div className={`message-bubble ${msg.role}`}>
              {msg.text}

              {/* Source Pages */}
              {msg.pages && msg.pages.length > 0 && (
                <div className="page-badge">
                  📄 Page(s): {msg.pages.join(", ")}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Premium AI Thinking Animation */}
        {loading && (
          <div className="message-row bot fade-in">
            <div className="message-bubble bot thinking">
              <div className="wave-loader">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef}></div>

      </div>
    </div>
  );
}
