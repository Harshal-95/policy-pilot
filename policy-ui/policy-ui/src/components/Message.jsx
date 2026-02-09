export default function Message({ role, text, page }) {
  return (
    <div className={`message-row ${role}`}>
      <div className={`message-bubble ${role}`}>
        {text}

        {page && (
          <div className="page-badge">
            📄 Page {page}
          </div>
        )}
      </div>
    </div>
  );
}
