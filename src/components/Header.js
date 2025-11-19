import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Calendar, LogOut, MessageCircle } from 'lucide-react';
import './Header.css';
import ChatbotModal from './ChatbotModal';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const openChat = () => setChatOpen(true);
  const closeChat = () => setChatOpen(false);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <Calendar className="logo-icon" />
          <span>ReserveTable</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
          <Link to="/find" className="nav-link">Find Restaurant</Link>
          <button type="button" onClick={openChat} className="nav-link" style={{border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:6}}>
            <MessageCircle size={16} /> Chat
          </button>
          {user && <Link to="/my-reservations" className="nav-link">My Reservations</Link>}
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-menu">
              <span className="user-name">
                <User size={16} />
                {user.name}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link register">Register</Link>
            </div>
          )}
        </div>
      </div>
      <ChatbotModal open={chatOpen} onClose={closeChat} />
    </header>
  );
};

export default Header;
