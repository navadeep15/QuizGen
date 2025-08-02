import React, { useState } from 'react'

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)

  // Sample quiz data
  const quizData = [
    {
      question: "What is React?",
      options: ["A JavaScript library", "A programming language", "A database", "An operating system"],
      correctAnswer: 0
    },
    {
      question: "Which hook is used for state management in React?",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      correctAnswer: 1
    },
    {
      question: "What does JSX stand for?",
      options: ["JavaScript XML", "JavaScript Extension", "JavaScript Syntax", "JavaScript XHTML"],
      correctAnswer: 0
    }
  ]

  const handleAnswerClick = (selectedAnswer) => {
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }
    
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
  }

  return (
    <div className="page">
      <h1>Quiz Page</h1>
      
      {currentQuestion < quizData.length ? (
        <div className="quiz-container">
          <div className="progress">
            Question {currentQuestion + 1} of {quizData.length}
          </div>
          
          <div className="question">
            <h2>{quizData[currentQuestion].question}</h2>
          </div>
          
          <div className="options">
            {quizData[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className="option-btn"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <h2>Quiz Completed!</h2>
          <p>Your score: {score} out of {quizData.length}</p>
          <p>Percentage: {Math.round((score / quizData.length) * 100)}%</p>
          <button onClick={resetQuiz} className="reset-btn">
            Take Quiz Again
          </button>
        </div>
      )}
    </div>
  )
}

export default Quiz 