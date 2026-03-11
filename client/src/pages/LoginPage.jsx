import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Login</h1>
        <p>Get access to your Orders, Wishlist and Recommendations</p>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-hint">
            <strong>Demo credentials:</strong><br />
            Email: test@example.com<br />
            Password: password123
          </div>
          <div className="form-group">
            <label>Email or Mobile Number</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="auth-terms">
            By continuing, you agree to Flipkart&apos;s{' '}
            <span className="auth-link">Terms of Use</span> and{' '}
            <span className="auth-link">Privacy Policy</span>.
          </p>
          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="auth-divider"><span>OR</span></div>
          <Link to="/signup" className="btn-auth-secondary">
            Create account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
