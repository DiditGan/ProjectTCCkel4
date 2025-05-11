import './App.css';
import React, { useState } from 'react';

// Mengimpor gambar logo dan lainnya dari folder assets
import logoImage from './assets/logo.png';
import grafisImage from './assets/grafis.png';
import rahelImage from './assets/Rahel.jpg';
import yedhitImage from './assets/Yedhit.jpg';

function App() {
  const [isLogin, setIsLogin] = useState(true); // Untuk toggle antara login dan register

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logoImage} alt="GiveTzy Logo" />
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#login">Login</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-text">
          <h1>GiveTzy</h1>
          <p> adalah aplikasi berbasis website yang memfasilitasi penjualan barang-barang bekas dengan harga lebih murah. Aplikasi ini dirancang untuk mendorong gaya hidup berkelanjutan dengan cara berbagi
barang yang masih layak pakai, mengurangi penumpukan barang di rumah, dan mengurangi
sampah rumah tangga. GiveTzy bukan hanya sekedar marketplace, tetapi lebih fokus pada nilai
sosial dan lingkungan dengan memberikan kemudahan dalam proses pertukaran dan donasi
barang.</p>
        </div>
        <div className="hero-image">
          <img src={grafisImage} alt="Gambar Grafis" />
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac venenatis est.</p>
        <div className="team">
          <div className="member">
            <img src={rahelImage} alt="Rahel" />
            <p>Rahel Anatasya Sinaga</p>
          </div>
          <div className="member">
            <img src={yedhitImage} alt="Yedhit" />
            <p>Yedhit Trisakti Tamma</p>
          </div>
        </div>
      </section>

      {/* Login & Register Section */}
      <section id="login" className="login-register">
        <div className="form-container">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form>
            {!isLogin && (
              <div className="input-field">
                <input type="text" placeholder="Enter Name" />
              </div>
            )}
            <div className="input-field">
              <input type="email" placeholder="Enter E-mail" />
            </div>
            <div className="input-field">
              <input type="password" placeholder="Enter Password" />
            </div>
            <button type="submit" className="submit-btn">{isLogin ? 'Login' : 'Sign Up'}</button>
            <button type="button" className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
            {!isLogin && (
              <div className="forgot-password">
                <a href="#">Lost Password? Click Here</a>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="contact">
          <p>Contact Us:</p>
          <p>+62 812-xxxx-xxxx</p>
          <p>GiveTzy220@email.com</p>
          <p>@GiveTzyApp</p>
        </div>
      </footer>
    </>
  );
}

export default App;
