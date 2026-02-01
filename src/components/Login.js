import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import GoogleLogin from './GoogleLogin';
import { authAPI } from '../utils/api';
import './Auth.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted with data:', formData);
    setLoading(true);

    try {
      console.log('Calling authAPI.login...');
      const result = await authAPI.login(formData);
      console.log('Login result:', result);
      
      if (result.success) {
        onLogin(result.data.user);
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.error || 'Login failed');
        console.error('Login failed:', result.error);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (user) => {
    try {
      console.log('Google login user data:', user);
      const result = await authAPI.googleAuth({
        googleId: user.id || user.googleId,
        name: user.name,
        email: user.email
      });
      
      if (result.success) {
        onLogin(result.data.user);
        toast.success(`Welcome ${user.name}! Login successful via Google.`);
        navigate('/');
      } else {
        toast.error(result.error || 'Google login failed');
      }
    } catch (error) {
      toast.error('Google login failed. Please try again.');
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = (error) => {
    toast.error('Google login failed. Please try again.');
    console.error('Google login error:', error);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">OR</div>

        <GoogleLogin 
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: demo@example.com</p>
          <p>Password: any password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
