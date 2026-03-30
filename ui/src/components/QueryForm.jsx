import '../styles/QueryForm.css';

function QueryForm({ query, setQuery, loading, error, onSubmit, onTemplateClick, isConnected }) {
  const templates = [
    { name: 'Users', query: 'Show all users with their registration date' },
    { name: 'Orders', query: 'Get top 10 orders by amount in the last 30 days' },
    { name: 'Analytics', query: 'Count orders per user for this month' },
    { name: 'Recent', query: 'Show the 5 most recent records' },
  ];

  const handleTemplateClick = (templateQuery) => {
    setQuery(templateQuery);
    onTemplateClick(templateQuery);
  };

  return (
    <div className="query-panel">

      {/* Header */}
      <div className="query-header">
        <span className="query-title">📝 Ask QueryGenie</span>
      </div>

      {!isConnected && (
        <div className="db-required-notice">
          ⚠️ Please connect to a database first
        </div>
      )}

      <form onSubmit={onSubmit} className="query-form">

        <textarea
          className="query-input"
          placeholder="Ask a question about your data..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={!isConnected || loading}
          required
        />

        {/* Templates */}
        <div className="template-group">
          {templates.map((template) => (
            <button
              key={template.name}
              type="button"
              className="template-btn"
              onClick={() => handleTemplateClick(template.query)}
              disabled={!isConnected}
            >
              {template.name}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button className="submit-btn" type="submit" disabled={loading || !isConnected}>
          {loading ? 'Running...' : 'Get Answer'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

    </div>
  );
}

export default QueryForm;