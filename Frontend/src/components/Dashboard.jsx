import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, quizAPI } from '../services/api'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [quizHistory, setQuizHistory] = useState([])
  const [createdQuizzes, setCreatedQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch all dashboard data in parallel
        const [statsData, historyData, quizzesData] = await Promise.all([
          userAPI.getUserStats(),
          userAPI.getQuizHistory(),
          userAPI.getCreatedQuizzes()
        ])

        if (statsData.success) setStats(statsData.data)
        if (historyData.success) setQuizHistory(historyData.data)
        if (quizzesData.success) {
          console.log('Dashboard quizzes response:', quizzesData)
          setCreatedQuizzes(quizzesData.data.quizzes || [])
        }
        
      } catch (error) {
        console.error('Dashboard data fetch error:', error)
        setError('Failed to load dashboard data')
        setCreatedQuizzes([]) // Ensure arrays are always arrays
        setQuizHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#666' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ color: '#007bff', margin: 0, fontSize: '1.5rem' }}>QuizGen</h1>
          </Link>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/dashboard" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
              Dashboard
            </Link>
            <Link to="/create-quiz" style={{ color: '#666', textDecoration: 'none' }}>
              Create Quiz
            </Link>
            <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>
              Browse Quizzes
            </Link>
          </nav>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666' }}>
            Welcome, {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            Here's your quiz activity overview and statistics.
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#007bff', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                {stats.quizzesCreated || 0}
              </h3>
              <p style={{ color: '#666', margin: 0 }}>Quizzes Created</p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#28a745', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                {stats.quizzesTaken || 0}
              </h3>
              <p style={{ color: '#666', margin: 0 }}>Quizzes Taken</p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#ffc107', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                {stats.averageScore ? `${stats.averageScore}%` : 'N/A'}
              </h3>
              <p style={{ color: '#666', margin: 0 }}>Average Score</p>
            </div>
            
            <div style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#17a2b8', margin: '0 0 0.5rem 0', fontSize: '2rem' }}>
                {stats.totalQuestions || 0}
              </h3>
              <p style={{ color: '#666', margin: 0 }}>Total Questions</p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Created Quizzes */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: '#333', margin: 0 }}>Created Quizzes</h3>
              <Link
                to="/create-quiz"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontSize: '0.875rem'
                }}
              >
                Create New
              </Link>
            </div>
            
                         {!Array.isArray(createdQuizzes) || createdQuizzes.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', margin: '2rem 0' }}>
                You haven't created any quizzes yet.
              </p>
            ) : (
                             <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                 {Array.isArray(createdQuizzes) && createdQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <h4 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>
                      {quiz.title}
                    </h4>
                    <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                      {quiz.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ color: '#666' }}>
                        {quiz.questions?.length || 0} questions
                      </span>
                      <span style={{ color: '#666' }}>
                        {quiz.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz History */}
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', margin: '0 0 1rem 0' }}>Recent Quiz Attempts</h3>
            
                         {!Array.isArray(quizHistory) || quizHistory.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', margin: '2rem 0' }}>
                You haven't taken any quizzes yet.
              </p>
            ) : (
                             <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                 {Array.isArray(quizHistory) && quizHistory.map((attempt) => (
                  <div
                    key={attempt._id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <h4 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>
                      {attempt.quiz?.title || 'Unknown Quiz'}
                    </h4>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ color: '#666' }}>
                        Score: {attempt.score}/{attempt.totalQuestions}
                      </span>
                      <span style={{ 
                        color: attempt.score >= (attempt.totalQuestions * 0.7) ? '#28a745' : '#dc3545',
                        fontWeight: '500'
                      }}>
                        {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                      </span>
                    </div>
                    <p style={{ color: '#666', margin: '0.5rem 0 0 0', fontSize: '0.75rem' }}>
                      Completed: {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '10px',
          marginTop: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', margin: '0 0 1rem 0' }}>Quick Actions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <Link
              to="/create-quiz"
              style={{
                padding: '1rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              Create New Quiz
            </Link>
            <Link
              to="/"
              style={{
                padding: '1rem',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              Browse Quizzes
            </Link>
            <Link
              to="/assign-quiz"
              style={{
                padding: '1rem',
                backgroundColor: '#ffc107',
                color: '#333',
                textDecoration: 'none',
                borderRadius: '5px',
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              Assign Quiz
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Dashboard 