import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { updateQuantity, removeFromCart, clearCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store/store';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import toast from 'react-hot-toast';
import { api } from '../../components/services/api/axios';

const CartPage: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const { userId, isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => 
    sum + (item.product.price || item.product.basePrice || 0) * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 5.99; // Free shipping over $100
  const total = subtotal + tax + shipping;

  // Check if user is authenticated when component mounts
  useEffect(() => {
    if (!isAuthenticated && items.length > 0) {
      toast.error("Please login to continue shopping");
      navigate("/login");
    }
  }, [isAuthenticated, items.length, navigate]);

  // Handle quantity updates
  const handleUpdateQuantity = (productId: string | number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  // Handle item removal
  const handleRemoveItem = (productId: string | number) => {
    dispatch(removeFromCart(productId));
  };

  // Navigate back to shopping
  const handleContinueShopping = () => {
    navigate("/home");
  };

  // Initiate PayPal checkout process
  const initiatePayPalCheckout = async () => {
    if (!isAuthenticated || !userId) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // 1. Create order first
      const orderItems = items.map(item => ({
        variantId: Number(item.product.variants?.[0]?.id || item.product.id),
        quantity: item.quantity
      }));
      
      const orderRequest = {
        buyerId: userId,
        items: orderItems
      };
      
      // Create order
      const orderResponse = await api.post("/orders", orderRequest);
      const orderId = orderResponse.data.id;
      
      // 2. Create PayPal payment
      const paymentRequest = {
        orderId: orderId,
        amount: total,
        currency: "USD",
        returnUrl: window.location.origin + "/order-confirmation",
        cancelUrl: window.location.origin + "/cart"
      };
      
      const paymentResponse = await api.post("/payments/paypal/create", paymentRequest);
      
      // 3. Redirect to PayPal approval URL
      if (paymentResponse.data.approvalUrl) {
        // Clear cart before redirecting
        dispatch(clearCart());
        window.location.href = paymentResponse.data.approvalUrl;
      } else {
        throw new Error("No PayPal approval URL received");
      }
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Error processing checkout");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center bg-gray-50">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Start adding some items to your cart!</p>
            </motion.div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/home')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/home')}
              className="inline-flex items-center mr-4 text-purple-600 hover:text-purple-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Continue Shopping</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-8">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {items.map((item) => {
                    const productPrice = item.product.price || item.product.basePrice || 0;
                    return (
                      <motion.li
                        key={item.product.id}
                        className="px-4 py-6 sm:px-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex items-center sm:items-start">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.product.image || "../../../public/assets/images/default-avatar.png"}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "../../../public/assets/images/default-avatar.png";
                              }}
                            />
                          </div>

                          <div className="ml-6 flex-1 flex flex-col">
                            <div className="flex">
                              <div className="min-w-0 flex-1">
                                <h4 className="text-lg font-medium text-gray-900">
                                  {item.product.name}
                                </h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  {typeof item.product.category === 'string'
                                    ? item.product.category
                                    : item.product.category?.name || ''}
                                </p>
                              </div>

                              <div className="ml-4 flex-shrink-0 flex">
                                <button
                                  type="button"
                                  className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                  onClick={() => handleRemoveItem(item.product.id)}
                                >
                                  <Trash2 className="h-5 w-5" />
                                  <span className="ml-1 hidden sm:inline">Remove</span>
                                </button>
                              </div>
                            </div>

                            <div className="flex-1 pt-2 flex items-end justify-between">
                              <div className="flex items-center border border-gray-200 rounded-md">
                                <button
                                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-2 rounded-l-md hover:bg-gray-100"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-2 rounded-r-md hover:bg-gray-100"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="flex items-center">
                                <p className="text-gray-500 mr-2">${productPrice.toFixed(2)} each</p>
                                <p className="text-lg font-medium text-gray-900">
                                  ${(productPrice * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 lg:col-span-4">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-6 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Shipping estimate</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Tax estimate (10%)</dt>
                      <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">Order total</dt>
                      <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                    </div>
                  </div>
                  
                  {/* PayPal Checkout Button */}
                  <div className="mt-6">
                    <button
                      onClick={initiatePayPalCheckout}
                      disabled={isProcessing || items.length === 0}
                      className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        isProcessing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 11.5V14C7 16 10 16 11 16" />
                            <path d="M10.9 11.5H14.2C14.2 11.5 15 12 15 12.5C15 13 14.2 13.7 14.2 13.7L11 16" />
                            <path d="M15.5 8.5C16 8.5 16.5 9 16.5 9.5C16.5 10 16 11 14.2 11H8.5" />
                            <path d="M7 8.5H8.5" />
                          </svg>
                          Checkout with PayPal
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      Secure payment processing by PayPal. Free shipping on orders over $100.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;