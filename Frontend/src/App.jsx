import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Import component files
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'
import About from './components/About'
import Login from './components/Login'
import SignUp from './components/SignUp'
import CreateQuiz from './components/CreateQuiz'
import Dashboard from './components/Dashboard'
import AssignQuiz from './components/AssignQuiz'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/create-quiz" element={
              <ProtectedRoute>
                <CreateQuiz />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/assign-quiz" element={
              <ProtectedRoute>
                <AssignQuiz />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
