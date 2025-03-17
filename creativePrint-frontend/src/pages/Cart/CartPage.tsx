// src/pages/cart/CartPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { updateQuantity, removeFromCart, clearCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store/store';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import toast from 'react-hot-toast';

// Mock credit card form component
const CreditCardForm = ({ onSubmit, isLoading }: { onSubmit: () => void, isLoading: boolean }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCVC] = useState('');
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  // Simple validation
  useEffect(() => {
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
    const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiry);
    const isCVCValid = /^\d{3,4}$/.test(cvc);
    const isNameValid = name.trim().length > 3;
    
    setIsValid(isCardNumberValid && isExpiryValid && isCVCValid && isNameValid);
  }, [cardNumber, expiry, cvc, name]);
  
  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 16) {
      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      setCardNumber(formatted);
    }
  };
  
  // Format expiry with slash
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length > 2) {
        setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpiry(value);
      }
    }
  };
  
  return (
    <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
      <h3 className="text-md font-medium mb-3">Credit Card Payment</h3>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">Name on card</label>
          <input
            type="text"
            id="card-name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card number</label>
          <input
            type="text"
            id="card-number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="4111 1111 1111 1111"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700">Expiry date</label>
            <input
              type="text"
              id="card-expiry"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="MM/YY"
              value={expiry}
              onChange={handleExpiryChange}
            />
          </div>
          
          <div>
            <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700">CVC</label>
            <input
              type="text"
              id="card-cvc"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="123"
              value={cvc}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 4) setCVC(value);
              }}
            />
          </div>
        </div>
        
        <button
          type="button"
          disabled={!isValid || isLoading}
          className={`w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isValid && !isLoading ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={onSubmit}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay ${(Math.round((subtotal + tax + shipping) * 100) / 100).toFixed(2)}
            </>
          )}
        </button>
      </div>
      
      <p className="mt-2 text-xs text-gray-500 text-center">
        This is a mock payment form for testing. No real payment will be processed.
      </p>
    </div>
  );
};

const CartPage: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);

  const handleUpdateQuantity = (productId: string | number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: string | number) => {
    dispatch(removeFromCart(productId));
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => 
    sum + (item.product.price || item.product.basePrice || 0) * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 0 ? 5.99 : 0; // Shipping fee
  const total = subtotal + tax + shipping;

  // Process mock payment
  const handleMockCheckout = () => {
    setLoading(true);
    // Simulate processing time
    setTimeout(() => {
      toast.success("Payment successful! Thank you for your order.");
      dispatch(clearCart());
      navigate('/order-confirmation');
      setLoading(false);
    }, 2000);
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
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
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
                      <dd className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</dd>
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
                  
                  {/* Payment Section */}
                  <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-3">Payment Methods</h3>
                    
                    {/* Payment Options */}
                    {!showCreditCardForm ? (
                      <div className="space-y-3">
                        {/* Credit Card Option */}
                        <button
                          onClick={() => setShowCreditCardForm(true)}
                          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
                          Pay with Credit Card
                        </button>
                        
                        {/* PayPal Option (currently disabled) */}
                        <button
                          onClick={() => {
                            toast.error("PayPal is currently unavailable. Please use credit card payment instead.");
                          }}
                          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
                          disabled
                        >
                          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 11C2.5 11 2.5 8 2.5 8V5c0-1.1.9-2 2-2h14.5c1.1 0 2 .9 2 2v3s0 3-4.5 3H7Z" />
                            <path d="M7 11v3c0 1.1.9 2 2 2h9.5c1.1 0 2-.9 2-2v-3" />
                            <path d="M14 16v4c0 1.1.9 2 2 2h3.5c1.1 0 2-.9 2-2v-4" />
                          </svg>
                          PayPal (Unavailable)
                        </button>
                      </div>
                    ) : (
                      // Credit Card Form
                      <CreditCardForm 
                        onSubmit={handleMockCheckout}
                        isLoading={loading}
                      />
                    )}
                    
                    {/* Back button when form is shown */}
                    {showCreditCardForm && !loading && (
                      <button
                        onClick={() => setShowCreditCardForm(false)}
                        className="mt-3 text-sm text-purple-600 hover:text-purple-800 flex items-center justify-center"
                      >
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        Back to payment options
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                      We offer free shipping for orders over $50
                    </p>
                    <div className="flex items-center justify-center mt-2">
                      <div className="h-6 bg-gray-200 rounded-md px-2 flex items-center space-x-1">
                        <span className="text-xs text-gray-600">Secure Payment</span>
                        <svg className="h-3 w-3 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
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