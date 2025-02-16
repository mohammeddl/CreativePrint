import LoginForm from './components/auth/loginForm/LoginForm'
import RegisterForm from './components/auth/registerForm/RegisterFrom'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<LoginForm />} />
    </Routes>
  </Router>
  )
}

export default App
