import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Flipkart</span>
          <span className="logo-sub">
            Explore <em style={{ color: '#ffe500' }}>Plus</em>
          </span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        {/* Nav Links */}
        <div className="navbar-links">
          {/* Account Dropdown */}
          <div className="nav-account" ref={dropdownRef}>
            <button
              className="nav-account-btn"
              onClick={() => setDropdownOpen((o) => !o)}
              aria-expanded={dropdownOpen}
            >
              <span className="nav-user-name">{user ? user.name.split(' ')[0] : 'Account'}</span>
              <span className="nav-user-label">{user ? 'Profile ▾' : 'Login ▾'}</span>
            </button>
            {dropdownOpen && (
              <div className="nav-dropdown">
                {!user ? (
                  <>
                    <div className="nav-dropdown-top">
                      <span>New customer?</span>
                      <Link to="/signup" onClick={() => setDropdownOpen(false)} className="nav-dropdown-signup">Sign Up</Link>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <Link to="/login" onClick={() => setDropdownOpen(false)}>Login</Link>
                  </>
                ) : (
                  <>
                    <div className="nav-dropdown-user">
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    <div className="nav-dropdown-divider" />
                    <Link to="/orders" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                    <Link to="/wishlist" onClick={() => setDropdownOpen(false)}>My Wishlist</Link>
                    <div className="nav-dropdown-divider" />
                    <button onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}>Logout</button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="nav-wishlist">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="cart-label">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="nav-cart">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="cart-label">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
