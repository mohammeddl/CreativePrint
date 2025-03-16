import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import clearCart from "../../store/slices/cartSlice";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { CheckCircle, ShoppingBag, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../components/services/api/axios";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [orderId, setOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const executePayment = async () => {
      // Extract PayPal parameters from URL
      const searchParams = new URLSearchParams(location.search);
      const paymentId = searchParams.get('paymentId');
      const payerId = searchParams.get('PayerID');
      
      if (!paymentId || !payerId) {
        setError("Invalid payment information in URL");
        setLoading(false);
        return;
      }
      
      try {
        // Execute PayPal payment
        const response = await api.get(`/payments/paypal/execute?paymentId=${paymentId}&PayerID=${payerId}`);
        
        if (response.data && response.data.orderId) {
          setOrderId(response.data.orderId);
          // Clear cart after successful payment
          dispatch(clearCart());
          toast.success("Payment completed successfully!");
        } else {
          throw new Error("Invalid response from payment execution");
        }
      } catch (err: any) {
        console.error("Payment execution error:", err);
        setError(err.response?.data?.message || "Failed to process payment");
        toast.error("There was a problem processing your payment");
      } finally {
        setLoading(false);
      }
    };
    
    executePayment();
  }, [location.search, dispatch]);
  
  const handleContinueShopping = () => {
    navigate("/home");
  };
  
  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/orders/${orderId}`);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Processing your payment...</h2>
            <p className="text-gray-500 mt-2">Please don't close this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-red-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-3">Payment Failed</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
              <button
                onClick={() => navigate("/cart")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Return to Cart
              </button>
              <button
                onClick={handleContinueShopping}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-white p-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
            
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-lg font-medium text-gray-900">#{orderId}</p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-8">
              A confirmation email has been sent to your registered email address.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
              <button
                onClick={handleContinueShopping}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
              </button>
              
              {orderId && (
                <button
                  onClick={handleViewOrder}
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Order
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}