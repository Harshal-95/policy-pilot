export default function Header({ selectedDocument }) {
  return (
    <div className="header-bar">

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {selectedDocument ? (
          <>
            <h3 style={{ margin: 0 }}>
              {selectedDocument.filename}
            </h3>

            <span className="status-badge">
              {selectedDocument.status}
            </span>
          </>
        ) : (
          <h3 style={{ margin: 0 }}>
            No document selected
          </h3>
        )}
      </div>

      {/* Profile */}
      <div className="profile-circle">
        P
      </div>

    </div>
  );
}
