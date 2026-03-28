import { useState } from "react";
import "../styles/DatabaseConfig.css";

function DatabaseConfig({ onConnect }) {
  const [dbType, setDbType] = useState("postgresql");
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("5432");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isLocked = isSaved && !isEditing;

  const handleDbTypeChange = (e) => {
    if (isLocked) return;

    const type = e.target.value;
    setDbType(type);

    if (type === "sqlite") {
      setPort("");
      setUsername("");
      setPassword("");
    } else if (type === "postgresql") {
      setPort("5432");
    } else if (type === "mysql") {
      setPort("3306");
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();

    // If already saved → switch to edit mode
    if (isSaved && !isEditing) {
      setIsEditing(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const connectionDetails =
        dbType === "sqlite"
          ? {
              username: null,
              password: null,
              host: null,
              port: null,
              database: null,
              db_path: database || "sample.db",
            }
          : {
              username,
              password,
              host,
              port: parseInt(port),
              database,
              db_path: "sample.db",
            };

      if (dbType === "sqlite" && !database) {
        throw new Error("Provide SQLite DB path");
      }

      if (dbType !== "sqlite" && (!username || !host || !port || !database)) {
        throw new Error("Fill all required fields");
      }

      onConnect(connectionDetails);

      setIsSaved(true);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setDbType("postgresql");
    setHost("localhost");
    setPort("5432");
    setUsername("");
    setPassword("");
    setDatabase("");
    setError(null);
    setIsSaved(false);
    setIsEditing(false);
    onConnect(null);
  };

  return (
    <div className="db-sidebar">
      <div className="db-header">
        <span className="db-title">🗄️ Database</span>
      </div>

      <form onSubmit={handleConnect} className="db-form">

        <div className="form-group">
          <label>Type</label>
          <select value={dbType} onChange={handleDbTypeChange} disabled={isLocked}>
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>

        {dbType !== "sqlite" && (
          <>
            <div className="form-group">
              <label>Host</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                disabled={isLocked}
              />
            </div>

            <div className="form-group">
              <label>Port</label>
              <input
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                disabled={isLocked}
              />
            </div>

            <div className="form-group">
              <label>User</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>{dbType === "sqlite" ? "DB Path" : "Database"}</label>
          <input
            type="text"
            value={database}
            onChange={(e) => setDatabase(e.target.value)}
            disabled={isLocked}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        {/* Actions */}
        <div className="db-actions">
          <button type="submit" className="connect-btn" disabled={loading}>
            {isSaved
              ? isEditing
                ? (loading ? "Saving..." : "Save")
                : "Edit"
              : (loading ? "Saving..." : "Save")}
          </button>

          {isSaved && (
            <button
              type="button"
              className="new-btn"
              onClick={handleNew}
            >
              New
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default DatabaseConfig;