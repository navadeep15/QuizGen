import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, error, clearError } = useAuth()

  // Clear any existing errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

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
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsSubmitting(true)
      setErrors({})
      
      try {
        const result = await login(formData)
        
        if (result.success) {
          // Redirect to the page they were trying to access, or home
          const from = location.state?.from?.pathname || '/'
          navigate(from, { replace: true })
        } else {
          // Show specific error message from backend
          setErrors({ general: result.message })
        }
      } catch (error) {
        console.error('Login error:', error)
        
        // Handle specific error types
        let errorMessage = 'Login failed. Please try again.'
        
        if (error.message.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials.'
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.'
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        setErrors({ general: errorMessage })
      } finally {
        setIsSubmitting(false)
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
        {(errors.general || error) && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '5px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {errors.general || error}
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
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isSubmitting ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#0056b3'
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#007bff'
              }
            }}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
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