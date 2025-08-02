import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        // TODO: Implement actual login API call
        console.log('Login attempt:', formData)
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // For now, just navigate to home page
        navigate('/')
        alert('Login successful!')
      } catch (error) {
        console.error('Login error:', error)
        setErrors({ general: 'Login failed. Please try again.' })
      }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ color: '#007bff', margin: 0, fontSize: '2rem' }}>QuizGen</h1>
          </Link>
          <h2 style={{ color: '#333', margin: '1rem 0 0.5rem 0' }}>Welcome Back</h2>
          <p style={{ color: '#666', margin: 0 }}>Sign in to your account</p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '5px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {errors.general}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.email ? '2px solid #dc3545' : '2px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.password ? '2px solid #dc3545' : '2px solid #e0e0e0',
                borderRadius: '5px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s ease'
              }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#666', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login 