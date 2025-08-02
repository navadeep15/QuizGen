import React, { useState } from 'react'

const Results = () => {
  const [results] = useState([
    {
      id: 1,
      quizName: "React Basics",
      score: 85,
      totalQuestions: 10,
      date: "2024-01-15",
      timeTaken: "15 minutes"
    },
    {
      id: 2,
      quizName: "JavaScript Fundamentals",
      score: 92,
      totalQuestions: 15,
      date: "2024-01-10",
      timeTaken: "20 minutes"
    },
    {
      id: 3,
      quizName: "CSS Styling",
      score: 78,
      totalQuestions: 12,
      date: "2024-01-05",
      timeTaken: "18 minutes"
    }
  ])

  const calculateAverageScore = () => {
    const totalScore = results.reduce((sum, result) => sum + result.score, 0)
    return Math.round(totalScore / results.length)
  }

  return (
    <div className="page">
      <h1>Results Page</h1>
      
      <div className="results-summary">
        <h2>Performance Summary</h2>
        <div className="stats">
          <div className="stat">
            <h3>Total Quizzes Taken</h3>
            <p>{results.length}</p>
          </div>
          <div className="stat">
            <h3>Average Score</h3>
            <p>{calculateAverageScore()}%</p>
          </div>
          <div className="stat">
            <h3>Best Score</h3>
            <p>{Math.max(...results.map(r => r.score))}%</p>
          </div>
        </div>
      </div>

      <div className="results-list">
        <h2>Recent Quiz Results</h2>
        {results.map((result) => (
          <div key={result.id} className="result-card">
            <div className="result-header">
              <h3>{result.quizName}</h3>
              <span className={`score ${result.score >= 80 ? 'high' : result.score >= 60 ? 'medium' : 'low'}`}>
                {result.score}%
              </span>
            </div>
            <div className="result-details">
              <p><strong>Questions:</strong> {result.totalQuestions}</p>
              <p><strong>Date:</strong> {result.date}</p>
              <p><strong>Time Taken:</strong> {result.timeTaken}</p>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${result.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Results 