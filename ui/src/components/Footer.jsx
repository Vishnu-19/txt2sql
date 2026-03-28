import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <span className="footer-text">
          © {currentYear} QueryGenie. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;