import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Navigation component
const Navigation = () => {
  const { user, logout } = useAuth()
  
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '1rem' }}>
      <Link to="/" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>Home</Link>
      <Link to="/quiz" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>Quiz</Link>
      <Link to="/results" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>Results</Link>
      <Link to="/about" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>About</Link>
      {user && (
        <Link to="/create-quiz" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>Create Quiz</Link>
      )}
    </nav>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogin = () => {
    navigate('/login')
  }

  const handleSignUp = () => {
    navigate('/signup')
  }

  const handleCreateQuiz = () => {
    navigate('/create-quiz')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="page">
      <Navigation />
      
      {/* Header with Auth Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>QuizGen</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                Welcome, {user.firstName}!
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: '2px solid #dc3545',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#c82333'
                  e.target.style.borderColor = '#c82333'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#dc3545'
                  e.target.style.borderColor = '#dc3545'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleLogin}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#007bff',
                  border: '2px solid #007bff',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#007bff'
                  e.target.style.color = 'white'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#007bff'
                }}
              >
                Login
              </button>
              <button 
                onClick={handleSignUp}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: '2px solid #007bff',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#0056b3'
                  e.target.style.borderColor = '#0056b3'
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#007bff'
                  e.target.style.borderColor = '#007bff'
                  }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>Welcome to QuizGen!</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Create, take, and analyze quizzes with our powerful platform.
          </p>
        </div>

        <div className="home-content">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Get Started with Quiz Generation</h2>
          <p style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem' }}>
            Create, take, and analyze quizzes with our powerful platform.
          </p>
          
          <div className="features" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div className="feature" style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>Create Quizzes</h3>
              <p>Generate custom quizzes with various question types</p>
              <button 
                onClick={handleCreateQuiz}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Create Quiz
              </button>
            </div>
            <div className="feature" style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>Take Quizzes</h3>
              <p>Test your knowledge with interactive quizzes</p>
              <button 
                onClick={() => navigate('/quiz')}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Take Quiz
              </button>
            </div>
            <div className="feature" style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>View Results</h3>
              <p>Track your progress and performance</p>
              <button 
                onClick={() => navigate('/results')}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                View Results
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            backgroundColor: '#e3f2fd',
            borderRadius: '10px',
            marginTop: '2rem'
          }}>
            <h3 style={{ color: '#1976d2', marginBottom: '1rem' }}>Ready to Get Started?</h3>
            <p style={{ marginBottom: '1.5rem' }}>Join thousands of users creating and taking quizzes!</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={handleCreateQuiz}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
              >
                Create Quiz
              </button>
              <button 
                onClick={handleSignUp}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '500',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 