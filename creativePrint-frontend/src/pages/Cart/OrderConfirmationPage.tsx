import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ShoppingCart } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <div className="max-w-md w-full mx-auto px-4">
          <motion.div 
            className="bg-white shadow overflow-hidden sm:rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-4 py-5 sm:p-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
              >
                <CheckCircle className="h-10 w-10 text-green-600" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-3 text-lg font-medium text-gray-900"
              >
                Order Confirmed!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-2 text-sm text-gray-500"
              >
                Thank you for your purchase. Your order has been processed successfully.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-4 bg-gray-50 p-4 rounded-md"
              >
                <p className="text-sm text-gray-600">Order Number:</p>
                <p className="text-lg font-bold text-gray-900">{orderNumber}</p>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-4 text-sm text-gray-500"
              >
                We've sent a confirmation email with all the details of your order.
                You can track your order status in your account.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-6 grid grid-cols-2 gap-3"
              >
                <button
                  onClick={() => navigate('/home')}
                  className="flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Continue Shopping
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;