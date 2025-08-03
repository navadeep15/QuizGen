import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { quizAPI } from '../services/api'

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    questions: [
      {
        id: 1,
        question: '',
        options: [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false }
        ]
      }
    ]
  })

  const navigate = useNavigate()

  const handleQuizInfoChange = (e) => {
    const { name, value } = e.target
    setQuizData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleQuestionChange = (questionId, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, question: value } : q
      )
    }))
  }

  const handleOptionChange = (questionId, optionId, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(opt =>
                opt.id === optionId ? { ...opt, text: value } : opt
              )
            }
          : q
      )
    }))
  }

  const handleCorrectOptionChange = (questionId, optionId) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map(opt =>
                opt.id === optionId
                  ? { ...opt, isCorrect: true }
                  : { ...opt, isCorrect: false }
              )
            }
          : q
      )
    }))
  }

  const addOption = (questionId) => {
    const question = quizData.questions.find(q => q.id === questionId)
    if (question.options.length < 5) {
      const newOptionId = Math.max(...question.options.map(opt => opt.id)) + 1
      setQuizData(prev => ({
        ...prev,
        questions: prev.questions.map(q =>
          q.id === questionId
            ? {
                ...q,
                options: [...q.options, { id: newOptionId, text: '', isCorrect: false }]
              }
            : q
        )
      }))
    }
  }

  const removeOption = (questionId, optionId) => {
    const question = quizData.questions.find(q => q.id === questionId)
    if (question.options.length > 2) {
      setQuizData(prev => ({
        ...prev,
        questions: prev.questions.map(q =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.filter(opt => opt.id !== optionId)
              }
            : q
        )
      }))
    }
  }

  const addQuestion = () => {
    const newQuestionId = Math.max(...quizData.questions.map(q => q.id)) + 1
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: newQuestionId,
          question: '',
          options: [
            { id: 1, text: '', isCorrect: false },
            { id: 2, text: '', isCorrect: false }
          ]
        }
      ]
    }))
  }

  const removeQuestion = (questionId) => {
    if (quizData.questions.length > 1) {
      setQuizData(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate quiz data
    if (!quizData.title.trim()) {
      alert('Please enter a quiz title')
      return
    }

    const hasInvalidQuestions = quizData.questions.some(q => {
      if (!q.question.trim()) return true
      if (q.options.some(opt => !opt.text.trim())) return true
      if (!q.options.some(opt => opt.isCorrect)) return true
      return false
    })

    if (hasInvalidQuestions) {
      alert('Please fill all questions, options, and select correct answers')
      return
    }

    try {
      const response = await quizAPI.createQuiz(quizData)
      
      if (response.success) {
        alert('Quiz created successfully!')
        navigate('/dashboard')
      } else {
        alert(response.message || 'Failed to create quiz. Please try again.')
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
      alert(error.message || 'Failed to create quiz. Please try again.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1rem 2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ color: '#007bff', margin: 0 }}>QuizGen</h1>
        </Link>
        <h2 style={{ color: '#333', margin: 0 }}>Create Quiz</h2>
      </div>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Quiz Information */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ color: '#333', marginBottom: '1.5rem' }}>Quiz Information</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#333',
                fontWeight: '500'
              }}>
                Quiz Title *
              </label>
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleQuizInfoChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#333',
                fontWeight: '500'
              }}>
                Description
              </label>
              <textarea
                name="description"
                value={quizData.description}
                onChange={handleQuizInfoChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e0e0e0',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                placeholder="Enter quiz description (optional)"
              />
            </div>
          </div>

          {/* Questions */}
          {quizData.questions.map((question, questionIndex) => (
            <div key={question.id} style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ color: '#333', margin: 0 }}>Question {questionIndex + 1}</h3>
                {quizData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Remove Question
                  </button>
                )}
              </div>

              {/* Question Text */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  Question Text *
                </label>
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your question"
                  required
                />
              </div>

              {/* Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#333',
                  fontWeight: '500'
                }}>
                  Options * (Select one correct answer)
                </label>
                
                {question.options.map((option, optionIndex) => (
                  <div key={option.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={option.isCorrect}
                      onChange={() => handleCorrectOptionChange(question.id, option.id)}
                      style={{ margin: 0 }}
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        border: '2px solid #e0e0e0',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(question.id, option.id)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {question.options.length < 5 && (
                  <button
                    type="button"
                    onClick={() => addOption(question.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    + Add Option
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Question Button */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <button
              type="button"
              onClick={addQuestion}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              + Add Question
            </button>
          </div>

          {/* Submit Button */}
          <div style={{
            textAlign: 'center',
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <button
              type="submit"
              style={{
                padding: '1rem 3rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '500'
              }}
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQuiz 