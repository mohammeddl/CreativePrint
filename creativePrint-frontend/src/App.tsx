import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import store from "./store/store";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin";
import PartnerDashboard from "./pages/dashboard/PartnerDashboard";
import ProfileEditPage from "./pages/profile/edit";
import ProductsPage from "./pages/products";
import LandingPage from "./pages/landing";
import LoginForm from "./components/auth/loginForm/LoginForm";
import RegisterForm from "./components/auth/registerForm/RegisterFrom";
import UnauthorizedPage from "./pages/unauthorized/UnauthorizedPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import ShoppingCartSlideOver from "./components/cart/ShoppingCartSlideOver";
import CartPage from "./pages/Cart/CartPage";
import OrderConfirmationPage from "./pages/Cart/OrderConfirmationPage";
import OrderHistoryPage from "./pages/orders/OrderHistoryPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position='top-right' />
        <ShoppingCartSlideOver /> 
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/unauthorized' element={<UnauthorizedPage />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <LandingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/home'
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/products/:productId'
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/cart'
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/order-confirmation'
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders/history'
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/orders/:orderId'
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/*'
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/dashboard/*'
            element={
              <ProtectedRoute allowedRoles={["PARTNER"]}>
                <PartnerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;