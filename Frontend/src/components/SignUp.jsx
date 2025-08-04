// SignUp.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SignUp.css'; // Create this for styles

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup, error, clearError } = useAuth();

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
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setErrors({});
      try {
        const { confirmPassword, ...signupData } = formData;
        const result = await signup(signupData);
        if (result.success) navigate('/dashboard');
        else setErrors({ general: result.message || 'Signup failed. Please try again.' });
      } catch (error) {
        console.error('Signup error:', error);
        setErrors({ general: error.message || 'Signup failed. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-left">
      <Link to="/" style={{ textDecoration: 'none' }}>

        <h1 className="brand">QuizGen</h1>
        </Link>
        <h2>Create your Account</h2>

        {/* <div className="social-login">
          <button className="google-btn">Google</button>
          <button className="facebook-btn">Facebook</button>
        </div> */}

        {/* <div className="divider"><span>or continue with email</span></div> */}
          <br />
          <br />
        {errors.general || error ? (
          <div className="error-box">{errors.general || error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="form">
          <div className="input-row">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="First Name"
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Last Name"
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
          </div>
          {errors.firstName && <p className="field-error">{errors.firstName}</p>}
          {errors.lastName && <p className="field-error">{errors.lastName}</p>}

          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? 'Creating Account...' : 'Create'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="signup-right" style={{backgroundImage: 'url(/signup.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
         
        {/* <div className="caption">
          <h3>Make Learning Interactive</h3>
          <br />
          <p>Turn lessons into exciting quizzes and keep learners engaged.</p>
        </div> */}
      </div>
    </div>
  );
};

export default SignUp;
