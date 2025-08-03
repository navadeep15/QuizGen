import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { quizAPI } from '../services/api'

const TakeAssignedQuiz = () => {
  const { quizId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [quiz, setQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(null)
  const [timeTaken, setTimeTaken] = useState(0) // Track actual time taken
  const [quizStartTime, setQuizStartTime] = useState(null) // Track when quiz started
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [results, setResults] = useState(null)
  const [lastClickedOption, setLastClickedOption] = useState(null)
  const [clickCount, setClickCount] = useState(0)
  
  // Removed auto-submission ref - no longer needed

  const handleSubmitQuiz = useCallback(async () => {
    // Prevent multiple submissions
    if (submitting || quizCompleted) {
      console.log('Submission already in progress or quiz completed')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      // Calculate final time taken
      const finalTimeTaken = Math.floor((Date.now() - quizStartTime) / 1000)

      console.log('=== QUIZ SUBMISSION DEBUG ===')
      console.log('Submitting quiz with data:', { 
        quizId, 
        answers, 
        timeTaken: finalTimeTaken,
        answersLength: answers.length,
        answersType: typeof answers,
        answersArray: Array.isArray(answers)
      })
      const response = await quizAPI.submitQuiz(quizId, { 
        answers,
        timeTaken: finalTimeTaken
      })
      console.log('=== END SUBMISSION DEBUG ===')
      
      console.log('Quiz submission response:', response)
      
      if (response.success) {
        setResults(response.data)
        setQuizCompleted(true)
      } else {
        setError(response.message || 'Failed to submit quiz')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setError(`Failed to submit quiz: ${error.message || 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }, [quizId, answers, timeTaken, quizStartTime, submitting, quizCompleted])

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true)
        console.log('Fetching assigned quiz with ID:', quizId)
        const response = await quizAPI.getAssignedQuiz(quizId)
        
        console.log('Assigned quiz response:', response)
        
        if (response.success) {
          console.log('Quiz data received:', response.data.quiz)
          console.log('Quiz questions:', response.data.quiz.questions)
          setQuiz(response.data.quiz)
          setTimeLeft(response.data.quiz.timeLimit * 60) // Convert to seconds
          const initialAnswers = new Array(response.data.quiz.questions.length).fill(null)
          console.log('Initializing answers array:', initialAnswers)
          setAnswers(initialAnswers)
          setQuizStartTime(Date.now()) // Start tracking time when quiz loads
        } else {
          console.error('Failed to load quiz:', response.message)
          setError('Failed to load quiz: ' + (response.message || 'Unknown error'))
        }
      } catch (error) {
        console.error('Error fetching quiz:', error)
        setError('Failed to load quiz: ' + (error.message || 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  // Timer for countdown (display only, no auto-submission)
  useEffect(() => {
    if (timeLeft && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }
    // Removed auto-submission logic - timer just displays countdown
  }, [timeLeft, quizCompleted])

  // Timer for tracking time taken
  useEffect(() => {
    if (quizStartTime && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeTaken(Math.floor((Date.now() - quizStartTime) / 1000))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quizStartTime, quizCompleted])

  // Debug: Monitor answers state changes
  useEffect(() => {
    console.log('Answers state changed:', answers)
  }, [answers])

  // Debug: Monitor quiz data changes
  useEffect(() => {
    if (quiz) {
      console.log('Quiz data updated:', {
        title: quiz.title,
        questionsCount: quiz.questions?.length,
        firstQuestion: quiz.questions?.[0],
        firstQuestionOptions: quiz.questions?.[0]?.options
      })
    }
  }, [quiz])

  const handleAnswerSelect = (answerIndex) => {
    console.log('=== ANSWER SELECTION DEBUG ===')
    console.log('Answer selected:', { 
      questionIndex: currentQuestion, 
      answerIndex, 
      currentAnswers: answers,
      quizQuestions: quiz?.questions?.length
    })
    
    if (!quiz || !quiz.questions || currentQuestion >= quiz.questions.length) {
      console.error('Invalid quiz state or question index')
      return
    }
    
    setLastClickedOption(answerIndex)
    setClickCount(prev => prev + 1)
    
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers]
      newAnswers[currentQuestion] = answerIndex
      console.log('Previous answers:', prevAnswers)
      console.log('Updated answers array:', newAnswers)
      console.log('=== END DEBUG ===')
      return newAnswers
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
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
          <p style={{ color: '#666' }}>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <div style={{
          maxWidth: '600px',
          margin: '2rem auto',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Quiz Not Found</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            The quiz data is not properly loaded. Please try again.
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
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <div style={{
          maxWidth: '600px',
          margin: '2rem auto',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>Error</h2>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
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
      </div>
    )
  }

  if (quizCompleted && results) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem'
        }}>
          {/* Header */}
          <header style={{
            backgroundColor: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ color: '#007bff', margin: 0 }}>QuizGen</h1>
              <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Quiz Results</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#666', margin: 0 }}>Welcome, {user?.firstName} {user?.lastName}</p>
            </div>
          </header>

          {/* Results Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#333', marginBottom: '1rem' }}>Quiz Completed! 🎉</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>{quiz.title}</p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '5px'
              }}>
                <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Score</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff', margin: 0 }}>
                  {results.score}/{results.totalQuestions}
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '5px'
              }}>
                <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Percentage</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', margin: 0 }}>
                  {results.percentage}%
                </p>
              </div>

              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '5px'
              }}>
                <h3 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>Time Taken</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107', margin: 0 }}>
                  {formatTime(results.timeTaken || 0)}
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: results.percentage >= 80 ? '#d4edda' : results.percentage >= 60 ? '#fff3cd' : '#f8d7da',
              color: results.percentage >= 80 ? '#155724' : results.percentage >= 60 ? '#856404' : '#721c24',
              padding: '1rem',
              borderRadius: '5px',
              marginBottom: '2rem'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>
                {results.percentage >= 80 ? 'Excellent! 🎉' : 
                 results.percentage >= 60 ? 'Good Job! 👍' : 'Keep Practicing! 💪'}
              </h4>
              <p style={{ margin: 0 }}>
                {results.percentage >= 80 ? 'You have a great understanding of this topic!' :
                 results.percentage >= 60 ? 'You have a good grasp of the material.' :
                 'Review the material and try again to improve your score.'}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link
                to="/dashboard"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontWeight: '500'
                }}
              >
                Go to Dashboard
              </Link>
              <Link
                to="/results"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontWeight: '500'
                }}
              >
                View All Results
              </Link>
            </div>
          </div>
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
          </nav>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666' }}>
            Welcome, {user?.firstName} {user?.lastName}
          </span>
        </div>
      </header>

      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {/* Quiz Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ color: '#333', margin: '0 0 0.5rem 0' }}>{quiz.title}</h2>
            <p style={{ color: '#666', margin: 0 }}>{quiz.description}</p>
          </div>
          
          {timeLeft && (
            <div style={{
              backgroundColor: timeLeft < 300 ? '#dc3545' : '#007bff',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              Time: {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{ color: '#666' }}>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span style={{ color: '#666' }}>
              {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
                     {/* Debug: Show current answers */}
           <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#999' }}>
             Debug - Current answer for this question: {answers[currentQuestion] !== null ? answers[currentQuestion] : 'None selected'}
             <br />
             Last clicked option: {lastClickedOption !== null ? lastClickedOption : 'None'}
             <br />
             Click count: {clickCount}
             <br />
             All answers: {JSON.stringify(answers)}
             <br />
             <button 
               onClick={() => {
                 console.log('Test button clicked')
                 handleAnswerSelect(0)
               }}
               style={{ 
                 padding: '0.25rem 0.5rem', 
                 fontSize: '0.7rem', 
                 backgroundColor: '#007bff', 
                 color: 'white', 
                 border: 'none', 
                 borderRadius: '3px',
                 cursor: 'pointer'
               }}
             >
               Test Select Option 0
             </button>
           </div>
          {/* Question status indicators */}
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
            {answers.map((answer, index) => (
              <div
                key={index}
                onClick={() => setCurrentQuestion(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: answer !== null ? '#28a745' : '#e9ecef',
                  border: index === currentQuestion ? '2px solid #007bff' : '1px solid #dee2e6',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={`Question ${index + 1}: ${answer !== null ? 'Answered' : 'Not answered'}`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>
            {quiz.questions[currentQuestion].question}
          </h3>
          {/* Debug info */}
          <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '1rem' }}>
            Question {currentQuestion + 1} of {quiz.questions.length}
            <br />
            Options count: {quiz.questions[currentQuestion].options?.length || 0}
            <br />
            Current answer: {answers[currentQuestion] !== null ? answers[currentQuestion] : 'None'}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quiz.questions[currentQuestion].options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index
              console.log(`Rendering option ${index}:`, {
                optionText: option.text,
                isSelected,
                currentAnswer: answers[currentQuestion],
                currentQuestion
              })
              return (
                <button
                  key={index}
                  onClick={() => {
                    console.log(`Button clicked for option ${index}`)
                    alert(`Button ${index} clicked!`) // Temporary alert to test
                    handleAnswerSelect(index)
                  }}
                  style={{
                    padding: '1rem',
                    border: isSelected ? '2px solid #007bff' : '2px solid #e0e0e0',
                    borderRadius: '5px',
                    backgroundColor: isSelected ? '#f8f9ff' : 'white',
                    color: '#333',
                    fontSize: '1rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {option.text} {isSelected ? '(SELECTED)' : ''}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: currentQuestion === 0 ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
              opacity: currentQuestion === 0 ? 0.6 : 1
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: submitting ? '#6c757d' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '5px',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            {error}
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

export default TakeAssignedQuiz 