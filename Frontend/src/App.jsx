import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

// Import component files
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'
import About from './components/About'
import Login from './components/Login'
import SignUp from './components/SignUp'
import CreateQuiz from './components/CreateQuiz'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
