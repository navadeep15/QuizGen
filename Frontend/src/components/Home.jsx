import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

// Navigation component
const Navigation = () => {
  const { user, logout } = useAuth()
  
  return (

    <nav className="navigation">
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/quiz" className="nav-link">Quiz</Link>
        <Link to="/results" className="nav-link">Results</Link>
        <Link to="/about" className="nav-link">About</Link>
        {user && (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/create-quiz" className="nav-link">Create Quiz</Link>
            <Link to="/assign-quiz" className="nav-link">Assign Quiz</Link>
          </>
        )}
      </div>

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
    <div className="home-page">
      
      {/* Header with Auth Buttons */}
      <div className="header-section">
        <div className="header-content">
          <div className="logo-section">
            <h1>QuizGen</h1>
          </div>
          <div className="auth-section">
            {user ? (
              <>
                <span className="welcome-text" style={{marginTop: '10px'}}>
                  Welcome, {user.firstName}!
                </span>

                <button 
                  onClick={() => navigate('/dashboard')}
                  className="btn"
                >
                  Dashboard
                </button>

                <button 
                  onClick={handleLogout}
                  className="btn btn-danger"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogin}
                  className="btn btn-outline"
                >
                  Login
                </button>
                <button 
                  onClick={handleSignUp}
                  className="btn btn-primary"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">Welcome to QuizGen!</h1>
          <p className="hero-subtitle">
            Create, take, and analyze quizzes with our powerful platform. 
            Transform learning and assessment with intelligent quiz generation.
          </p>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Get Started with Quiz Generation</h2>
          <p className="section-subtitle">
            Discover powerful tools to create engaging quizzes and track learning progress.
          </p>
          
          <div className="features-grid">
            <div className="feature-card scale-in">
              <div className="feature-icon">Q</div>
              <h3 className="feature-title">Create Quizzes</h3>
              <p className="feature-description">
                Generate custom quizzes with various question types, difficulty levels, and interactive elements.
              </p>
              <button 
                onClick={handleCreateQuiz}
                className="feature-btn"
              >
                Create Quiz
              </button>
            </div>

            <div className="feature-card scale-in">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Take Quizzes</h3>
              <p className="feature-description">
                Test your knowledge with interactive quizzes featuring instant feedback and detailed explanations.
              </p>
              <button 

                onClick={() => navigate('assigned-quizzes')}
                className="feature-btn"

                
              >
                Take Quiz
              </button>
            </div>

            <div className="feature-card scale-in">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">View Results</h3>
              <p className="feature-description">
                Track your progress and performance with comprehensive analytics and detailed reports.
              </p>
              <button 
                onClick={() => navigate('/results')}
                className="feature-btn"
              >
                View Results
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Get Started?</h3>
            <p className="cta-description">
              Join thousands of users creating and taking quizzes to enhance learning and assessment!
            </p>
            <div className="cta-buttons">
              <button 
                onClick={handleCreateQuiz}
                className="cta-btn cta-btn-primary"
              >
                Create Your First Quiz
              </button>
              {!user && (
                <button 
                  onClick={handleSignUp}
                  className="cta-btn cta-btn-secondary"
                >
                  Sign Up Free
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home