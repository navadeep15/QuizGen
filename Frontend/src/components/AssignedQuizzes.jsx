import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { quizAPI } from '../services/api'

const AssignedQuizzes = () => {
  const { user } = useAuth()
  const [assignedQuizzes, setAssignedQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAssignedQuizzes = async () => {
      try {
        setLoading(true)
        const response = await quizAPI.getAssignedQuizzes()
        
        if (response.success) {
          setAssignedQuizzes(response.data.assignments || [])
        } else {
          setError('Failed to load assigned quizzes')
        }
      } catch (error) {
        console.error('Error fetching assigned quizzes:', error)
        setError('Failed to load assigned quizzes')
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedQuizzes()
  }, [])

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <p style={{ color: '#666' }}>Loading assigned quizzes...</p>
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
            <Link to="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/assigned-quizzes" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
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
        </div>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>
            Your Assigned Quizzes 📚
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            Here are all the quizzes that have been assigned to you. Click on any quiz to start taking it.
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

        {/* Quizzes List */}
        {assignedQuizzes.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>No Assigned Quizzes</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              You don't have any quizzes assigned to you yet. Check back later or contact your administrator.
            </p>
            <Link
              to="/dashboard"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: '500'
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            {assignedQuizzes.map((assignment) => (
              <div
                key={assignment._id}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  border: '2px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: assignment.status === 'pending' ? 'pointer' : 'default'
                }}
                onMouseEnter={(e) => {
                  if (assignment.status === 'pending') {
                    e.target.style.borderColor = '#007bff'
                    e.target.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (assignment.status === 'pending') {
                    e.target.style.borderColor = 'transparent'
                    e.target.style.transform = 'translateY(0)'
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>
                      {assignment.quiz.title}
                    </h3>
                    <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>
                      {assignment.quiz.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      fontSize: '0.875rem',
                      color: '#666'
                    }}>
                      <span>
                        <strong>Assigned by:</strong> {assignment.assignedBy.firstName} {assignment.assignedBy.lastName}
                      </span>
                      <span>
                        <strong>Assigned on:</strong> {formatDate(assignment.assignedAt)}
                      </span>
                      {assignment.quiz.timeLimit && (
                        <span>
                          <strong>Time limit:</strong> {assignment.quiz.timeLimit} minutes
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      backgroundColor: getStatusColor(assignment.status),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {getStatusText(assignment.status)}
                    </span>
                    
                    {assignment.status === 'completed' && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
                          {assignment.score}/{assignment.totalQuestions}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          {Math.round((assignment.score / assignment.totalQuestions) * 100)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {assignment.status === 'pending' && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <div style={{ color: '#666', fontSize: '0.875rem' }}>
                      {assignment.expiresAt && (
                        <span>
                          <strong>Expires:</strong> {formatDate(assignment.expiresAt)}
                        </span>
                      )}
                    </div>
                    
                    <Link
                      to={`/take-quiz/${assignment.quiz._id}`}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}
                    >
                      Start Quiz
                    </Link>
                  </div>
                )}

                {assignment.status === 'completed' && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e0e0e0'
                  }}>
                    <div style={{ color: '#666', fontSize: '0.875rem' }}>
                      <strong>Completed:</strong> {formatDate(assignment.completedAt)}
                    </div>
                    
                    <Link
                      to="/results"
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontWeight: '500',
                        display: 'inline-block'
                      }}
                    >
                      View Results
                    </Link>
                  </div>
                )}

                {assignment.status === 'expired' && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e0e0e0',
                    textAlign: 'center'
                  }}>
                    <p style={{ color: '#dc3545', margin: 0, fontSize: '0.875rem' }}>
                      This quiz has expired and can no longer be taken.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '10px',
          marginTop: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', margin: '0 0 1rem 0' }}>How It Works</h3>
          <ul style={{ color: '#666', margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Pending:</strong> Quizzes you haven't taken yet
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Completed:</strong> Quizzes you've finished with your score shown
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Expired:</strong> Quizzes that are no longer available
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Click "Start Quiz" to begin taking a pending quiz
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              View detailed results in the Results section
            </li>
          </ul>
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

export default AssignedQuizzes 