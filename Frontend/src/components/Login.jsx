import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const result = await login(formData);
        if (result.success) navigate('/dashboard');
        else setErrors({ general: result.message || 'Login failed. Try again.' });
      } catch (err) {
        setErrors({ general: err.message || 'Login failed.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="signup-right" style={{backgroundImage: 'url(/signup.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      </div>
      <div className="login-left">
      <Link to="/" style={{ textDecoration: 'none' }}>

        <h1 className="brand">QuizGen</h1>
        </Link>
        <h2>Welcome Back</h2>

        {errors.general || error ? (
          <div className="error-box">{errors.general || error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

    </div>
  );
};

export default Login;
