import { useState } from 'react';
import '../styles/ResultsDisplay.css';

function ResultsDisplay({ result, loading, copied, onCopySQL }) {
  const [showSQL, setShowSQL] = useState(false);

  if (!result && !loading) return null;

  return (
    <div className="results-panel">

      {/* Header */}
      <div className="results-header">
        <span className="results-title">📊 What We Found</span>

        {result?.cached && (
          <span className="cache-badge">⚡ Cached</span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          Running query...
        </div>
      )}

      {/* Content */}
      {result && (
        <div className="results-content">

          {/* Insights */}
          {result.response && (
            <div className="result-block">
              <div className="block-title">💡 Key Insights</div>
              <div className="response-box">
                {result.response}
              </div>
            </div>
          )}

          {/* SQL Toggle */}
          <div className="result-block">
            <div className="sql-header">
              <span className="block-title">SQL</span>

              <button
                className="toggle-btn"
                onClick={() => setShowSQL(!showSQL)}
              >
                {showSQL ? 'Hide' : 'View'}
              </button>
            </div>

            {showSQL && (
              <div className="result-code">
                <button
                  className="copy-btn"
                  onClick={onCopySQL}
                >
                  {copied ? '✓' : 'Copy'}
                </button>

                <pre>{result.sql || 'No SQL generated.'}</pre>
              </div>
            )}
          </div>

          {/* Error */}
          {result.error && (
            <div className="result-block">
              <div className="block-title">Error</div>
              <div className="error-box">
                {result.error}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default ResultsDisplay;