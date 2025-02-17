import { Provider } from 'react-redux'
import LoginForm from './components/auth/loginForm/LoginForm'
import RegisterForm from './components/auth/registerForm/RegisterFrom'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import store from './store/store'
import ProductsPage from './pages/products'
import ProfileEditPage from './pages/profile/edit'
import LandingPage from './pages/landing'

function App() {

  return (
    <Provider store={store}>

    <Router>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<LandingPage />} />
      <Route path='/home' element={<ProductsPage />}/>
      <Route path='/profile' element={<ProfileEditPage/> }/>
    </Routes>
  </Router>
      </Provider>
  )
}

export default App
