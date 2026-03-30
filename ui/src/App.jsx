import { useState } from 'react';
import Header from './components/Header';
import DatabaseConfig from './components/DatabaseConfig';
import QueryForm from './components/QueryForm';
import ResultsDisplay from './components/ResultsDisplay';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [dbConfig, setDbConfig] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleConnect = (config) => {
    // Backend validation will handle the actual connection check
    // Frontend just needs to store the config
    if (config) {
      setDbConfig(config);
      setIsConnected(true);
      setError(null);
    } else {
      setDbConfig(null);
      setIsConnected(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!dbConfig || !isConnected) {
        throw new Error('Please connect to a database first');
      }

      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          db_config: dbConfig,
          question: query,
        }),
      });

      if (!response.ok) {
        let msg = 'Failed to execute query';
        try {
          const errData = await response.json();
          msg = errData.detail || errData.message || msg;
        } catch {
          msg = response.statusText || msg;
        }
        throw new Error(msg);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySQL = () => {
    if (!result?.sql) return;
    navigator.clipboard.writeText(result.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyResults = () => {
    if (!result?.data) return;
    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content full-width">
        <div className="layout">

          {/* Sidebar (Always visible) */}
          <aside className="sidebar">
            <DatabaseConfig
              onConnect={handleConnect}
            />
          </aside>

          {/* Main Panel */}
          <section className="main-panel">
            <QueryForm
              query={query}
              setQuery={setQuery}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
              onTemplateClick={() => {}}
              isConnected={isConnected}
            />

            <ResultsDisplay
              result={result}
              loading={loading}
              copied={copied}
              onCopySQL={handleCopySQL}
              onCopyResults={handleCopyResults}
            />
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;