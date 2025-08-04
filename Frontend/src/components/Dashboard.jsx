import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userAPI, quizAPI } from '../services/api'

const Dashboard = () => {
  const { user,logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [assignedQuizzes, setAssignedQuizzes] = useState([])
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch all dashboard data
        const [statsResponse, assignedResponse, resultsResponse] = await Promise.all([
          userAPI.getUserStats(),
          quizAPI.getAssignedQuizzes(),
          quizAPI.getAssignmentResults()
        ])

        if (statsResponse.success) {
          setStats(statsResponse.data)
        }
        
        if (assignedResponse.success) {
          setAssignedQuizzes(assignedResponse.data.assignments || [])
        }
        
        if (resultsResponse.success) {
          setRecentResults(resultsResponse.data.slice(0, 3)) // Show only 3 most recent
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ffc107'
      case 'completed':
        return '#28a745'
      case 'expired':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'completed':
        return 'Completed'
      case 'expired':
        return 'Expired'
      default:
        return 'Unknown'
    }
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
            <Link to="/assigned-quizzes" style={{ color: '#666', textDecoration: 'none' }}>
              Assigned Quizzes
            </Link>
            <Link to="/results" style={{ color: '#666', textDecoration: 'none' }}>
              Results
            </Link>
          </nav>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666' }}>
            Welcome, {user?.firstName} {user?.lastName}
          </span>
          <button 
                  onClick={handleLogout}
                  className="btn btn-danger"
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
            Here's an overview of your quiz activity and assigned tasks.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '5px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Statistics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Total Quizzes</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
              {stats?.totalQuizzes || 0}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Average Score</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              {stats?.averageScore || 0}%
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Assigned Quizzes</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
              {assignedQuizzes.length}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Completed</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              {assignedQuizzes.filter(q => q.status === 'completed').length}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', margin: '0 0 1.5rem 0' }}>Quick Actions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <Link
              to="/assigned-quizzes"
              style={{
                padding: '1rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '500',
                display: 'block'
              }}
            >
              📚 View Assigned Quizzes
            </Link>
            
            <Link
              to="/results"
              style={{
                padding: '1rem',
                backgroundColor: '#28a745',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '500',
                display: 'block'
              }}
            >
              📊 View Results
            </Link>
            
            <Link
              to="/create-quiz"
              style={{
                padding: '1rem',
                backgroundColor: '#ffc107',
                color: '#333',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '500',
                display: 'block'
              }}
            >
              ✏️ Create Quiz
            </Link>
            
            <Link
              to="/assign-quiz"
              style={{
                padding: '1rem',
                backgroundColor: '#6c757d',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: '500',
                display: 'block'
              }}
            >
              📤 Assign Quiz
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Pending Assignments */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', margin: '0 0 1.5rem 0' }}>📋 Pending Assignments</h3>
            
            {assignedQuizzes.filter(q => q.status === 'pending').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <p style={{ color: '#666', margin: 0 }}>No pending assignments!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {assignedQuizzes
                  .filter(q => q.status === 'pending')
                  .slice(0, 3)
                  .map((assignment) => (
                    <div
                      key={assignment._id}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <h4 style={{ color: '#333', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                        {assignment.quiz.title}
                      </h4>
                      <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                        Assigned by: {assignment.assignedBy.firstName} {assignment.assignedBy.lastName}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          backgroundColor: getStatusColor(assignment.status),
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {getStatusText(assignment.status)}
                        </span>
                        <Link
                          to={`/take-quiz/${assignment.quiz._id}`}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          Start Quiz
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
            {assignedQuizzes.filter(q => q.status === 'pending').length > 3 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link
                  to="/assigned-quizzes"
                  style={{
                    color: '#007bff',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  View all {assignedQuizzes.filter(q => q.status === 'pending').length} pending assignments →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', margin: '0 0 1.5rem 0' }}>📈 Recent Results</h3>
            
            {recentResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <p style={{ color: '#666', margin: 0 }}>No completed quizzes yet!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {recentResults.map((result) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100)
                  
                  return (
                    <div
                      key={result._id}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <h4 style={{ color: '#333', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
                        {result.quiz.title}
                      </h4>
                      <p style={{ color: '#666', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                        Assigned by: {result.assignedBy.firstName} {result.assignedBy.lastName}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#007bff' }}>
                            {result.score}/{result.totalQuestions}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            {percentage}%
                          </div>
                        </div>
                        <span style={{
                          backgroundColor: percentage >= 80 ? '#28a745' : percentage >= 60 ? '#ffc107' : '#dc3545',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {recentResults.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link
                  to="/results"
                  style={{
                    color: '#007bff',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  View all results →
                </Link>
              </div>
            )}
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