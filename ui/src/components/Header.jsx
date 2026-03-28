import '../styles/Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">

        {/* Left: Logo */}
        <div className="header-left">
          <h1 className="app-logo">⚡ QueryGenie</h1>
        </div>

        {/* Center: Navigation */}
        <nav className="header-nav">
          <button className="nav-item active">Query</button>
          <button className="nav-item">History</button>
          <button className="nav-item">Saved</button>
        </nav>

        {/* Right: Actions */}
        <div className="header-right">
          <button className="header-btn">Docs</button>
        </div>

      </div>
    </header>
  );
}

export default Header;