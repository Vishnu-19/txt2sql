import { useState } from "react";
import "../styles/DatabaseConfig.css";

function DatabaseConfig({ onConnect }) {
  const [inputMode, setInputMode] = useState("fields"); // "fields" or "uri"
  const [dbType, setDbType] = useState("postgresql");
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("5432");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [database, setDatabase] = useState("");
  const [dbUri, setDbUri] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationMessage, setValidationMessage] = useState(null);
  const [tables, setTables] = useState([]);

  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

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

  const validateConnection = async (config) => {
    try {
      const response = await fetch("http://localhost:8000/validate-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ db_config: config }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || data.message || "Connection failed");
      }

      return data;
    } catch (err) {
      throw new Error(err.message || "Validation error");
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
    setValidationMessage(null);
    setTables([]);

    try {
      let connectionDetails;

      if (inputMode === "uri") {
        if (!dbUri) throw new Error("Provide database URI");
        connectionDetails = { db_uri: dbUri };
      } else {
        // Fields mode
        if (dbType === "sqlite") {
          if (!database) throw new Error("Provide SQLite DB path");
          connectionDetails = {
            db_path: database,
          };
        } else {
          if (!username || !host || !port || !database) {
            throw new Error("Fill all required fields");
          }
          connectionDetails = {
            username,
            password,
            host,
            port: parseInt(port),
            database,
          };
        }
      }

      // Validate connection with backend
      const validationResult = await validateConnection(connectionDetails);

      // Success
      setValidationMessage(validationResult.message);
      setTables(validationResult.tables || []);
      setIsSaved(true);
      setIsEditing(false);
      setIsConnected(true);
      onConnect(connectionDetails);
    } catch (err) {
      setError(err.message || "Connection failed");
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setInputMode("fields");
    setDbType("postgresql");
    setHost("localhost");
    setPort("5432");
    setUsername("");
    setPassword("");
    setDatabase("");
    setDbUri("");
    setError(null);
    setValidationMessage(null);
    setTables([]);
    setIsSaved(false);
    setIsEditing(false);
    setIsConnected(false);
    onConnect(null);
  };

  return (
    <div className="db-sidebar">
      <div className="db-header">
        <span className="db-title">🗄️ Database</span>
      </div>

      {/* Connected State - Collapsed View */}
      {isConnected && !isEditing && (
        <div className="connection-info">
          <div className="connection-status">
            <span className="status-dot">●</span>
            Connected
          </div>
          
          {/* Tables Section */}
          {tables.length > 0 && (
            <div className="tables-section">
              <div className="tables-title">📋 Tables ({tables.length})</div>
              <div className="tables-list">
                {tables.slice(0, 5).map((table) => (
                  <div key={table} className="table-item">
                    {table}
                  </div>
                ))}
                {tables.length > 5 && (
                  <div className="table-item-more">
                    +{tables.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit / New Buttons */}
          <div className="db-actions">
            <button
              type="button"
              className="connect-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              type="button"
              className="new-btn"
              onClick={handleNew}
            >
              New
            </button>
          </div>
        </div>
      )}

      {/* Form - Visible when not connected OR when editing */}
      {(!isConnected || isEditing) && (
        <form onSubmit={handleConnect} className="db-form">
          {/* Mode Toggle */}
          {!isLocked && (
            <div className="mode-toggle">
              <button
                type="button"
                className={`mode-btn ${inputMode === "fields" ? "active" : ""}`}
                onClick={() => setInputMode("fields")}
              >
                Details
              </button>
              <button
                type="button"
                className={`mode-btn ${inputMode === "uri" ? "active" : ""}`}
                onClick={() => setInputMode("uri")}
              >
                URI
              </button>
            </div>
          )}

          {/* URI Mode */}
          {inputMode === "uri" && (
            <div className="form-group">
              <label>Connection URI</label>
              <input
                type="text"
                value={dbUri}
                onChange={(e) => setDbUri(e.target.value)}
                placeholder="postgresql://user:pass@localhost:5432/dbname"
                disabled={isLocked}
              />
            </div>
          )}

          {/* Fields Mode */}
          {inputMode === "fields" && (
            <>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={dbType}
                  onChange={handleDbTypeChange}
                  disabled={isLocked}
                >
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
            </>
          )}

          {/* Error */}
          {error && <div className="form-error">{error}</div>}

          {/* Validation Success */}
          {validationMessage && isConnected && (
            <div className="form-success">
              ✓ {validationMessage}
            </div>
          )}

          {/* Actions */}
          <div className="db-actions">
            <button type="submit" className="connect-btn" disabled={loading}>
              {loading
                ? isConnected
                  ? "Updating..."
                  : "Validating..."
                : isSaved
                ? isEditing
                  ? "Save"
                  : "Connect"
                : "Connect"}
            </button>

            {isEditing && isConnected && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default DatabaseConfig;