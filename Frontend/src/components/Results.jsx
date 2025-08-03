import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { quizAPI } from '../services/api'

const Results = () => {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedResult, setSelectedResult] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        const response = await quizAPI.getAssignmentResults()
        
        if (response.success) {
          setResults(response.data || [])
        } else {
          setError('Failed to load results')
        }
      } catch (error) {
        console.error('Error fetching results:', error)
        setError('Failed to load results')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#28a745'
    if (percentage >= 60) return '#ffc107'
    return '#dc3545'
  }

  const getScoreText = (percentage) => {
    if (percentage >= 80) return 'Excellent'
    if (percentage >= 60) return 'Good'
    return 'Needs Improvement'
  }

  const createPieChart = (score, totalQuestions) => {
    const percentage = Math.round((score / totalQuestions) * 100)
    const radius = 60
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e9ecef"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={getScoreColor(percentage)}
            strokeWidth="12"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(percentage) }}>
            {percentage}%
          </div>
        </div>
      </div>
    )
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
          <p style={{ color: '#666' }}>Loading results...</p>
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
            <Link to="/assigned-quizzes" style={{ color: '#666', textDecoration: 'none' }}>
              Assigned Quizzes
            </Link>
            <Link to="/results" style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
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

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>
            Your Quiz Results 📊
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            View detailed results from all your completed assigned quizzes.
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

        {/* Results Summary */}
        {results.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333', margin: '0 0 1.5rem 0' }}>Summary</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
                  {results.length}
                </div>
                <div style={{ color: '#666' }}>Quizzes Completed</div>
              </div>
              
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
                  {Math.round(results.reduce((sum, result) => sum + (result.score / result.totalQuestions * 100), 0) / results.length)}%
                </div>
                <div style={{ color: '#666' }}>Average Score</div>
              </div>
              
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                  {results.reduce((sum, result) => sum + result.score, 0)}
                </div>
                <div style={{ color: '#666' }}>Total Points</div>
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {results.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ color: '#333', marginBottom: '1rem' }}>No Results Yet</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              You haven't completed any assigned quizzes yet. Check your assigned quizzes to get started!
            </p>
            <Link
              to="/assigned-quizzes"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: '500'
              }}
            >
              View Assigned Quizzes
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1.5rem'
          }}>
            {results.map((result) => {
              const percentage = Math.round((result.score / result.totalQuestions) * 100)
              
              return (
                <div
                  key={result._id}
                  style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => setSelectedResult(selectedResult === result._id ? null : result._id)}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: '2rem',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>
                        {result.quiz.title}
                      </h3>
                      <p style={{ color: '#666', margin: '0 0 0.5rem 0' }}>
                        {result.quiz.description}
                      </p>
                      <div style={{
                        display: 'flex',
                        gap: '2rem',
                        fontSize: '0.875rem',
                        color: '#666'
                      }}>
                        <span>
                          <strong>Assigned by:</strong> {result.assignedBy.firstName} {result.assignedBy.lastName}
                        </span>
                        <span>
                          <strong>Completed:</strong> {formatDate(result.completedAt)}
                        </span>
                        <span>
                          <strong>Assigned:</strong> {formatDate(result.assignedAt)}
                        </span>
                        <span>
                          <strong>Time Taken:</strong> {formatTime(result.timeTaken || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      {createPieChart(result.score, result.totalQuestions)}
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getScoreColor(percentage) }}>
                        {result.score}/{result.totalQuestions}
                      </div>
                      <div style={{ fontSize: '1.1rem', color: getScoreColor(percentage), fontWeight: '500' }}>
                        {percentage}%
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                        {getScoreText(percentage)}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedResult === result._id && (
                    <div style={{
                      marginTop: '2rem',
                      paddingTop: '2rem',
                      borderTop: '1px solid #e0e0e0'
                    }}>
                      <h4 style={{ color: '#333', margin: '0 0 1rem 0' }}>Detailed Breakdown</h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem'
                      }}>
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '1rem',
                          borderRadius: '5px'
                        }}>
                          <h5 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Score Analysis</h5>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            <div>Correct Answers: {result.score}</div>
                            <div>Total Questions: {result.totalQuestions}</div>
                            <div>Percentage: {percentage}%</div>
                            <div>Performance: {getScoreText(percentage)}</div>
                            <div>Time Taken: {formatTime(result.timeTaken || 0)}</div>
                          </div>
                        </div>
                        
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '1rem',
                          borderRadius: '5px'
                        }}>
                          <h5 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Quiz Information</h5>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            <div>Title: {result.quiz.title}</div>
                            <div>Description: {result.quiz.description}</div>
                            <div>Assigned by: {result.assignedBy.firstName} {result.assignedBy.lastName}</div>
                          </div>
                        </div>
                        
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '1rem',
                          borderRadius: '5px'
                        }}>
                          <h5 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Timeline</h5>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            <div>Assigned: {formatDate(result.assignedAt)}</div>
                            <div>Completed: {formatDate(result.completedAt)}</div>
                            <div>Time taken: {Math.round((new Date(result.completedAt) - new Date(result.assignedAt)) / (1000 * 60 * 60 * 24))} days</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
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

export default Results 