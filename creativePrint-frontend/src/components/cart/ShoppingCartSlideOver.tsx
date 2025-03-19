import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { closeCart, updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { RootState } from '../../store/store';

const ShoppingCartSlideOver: React.FC = () => {
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => 
    sum + (item.product.price || item.product.basePrice || 0) * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/cart');
  };

  const handleUpdateQuantity = (productId: string | number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: string | number) => {
    dispatch(removeFromCart(productId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={() => dispatch(closeCart())}
      />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        <motion.div 
          className="w-screen max-w-md pointer-events-auto"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                <div className="ml-3 flex h-7 items-center">
                  <button 
                    type="button" 
                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => dispatch(closeCart())}
                  >
                    <span className="absolute -inset-0.5"></span>
                    <span className="sr-only">Close panel</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <button 
                      className="mt-4 text-purple-600 font-medium flex items-center"
                      onClick={() => {
                        dispatch(closeCart());
                        navigate('/home');
                      }}
                    >
                      Continue shopping 
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => {
                        const productPrice = item.product.price || item.product.basePrice || 0;
                        return (
                          <li key={item.product.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
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

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.product.name}</h3>
                                  <p className="ml-4">${(productPrice * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  ${productPrice.toFixed(2)} each
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center">
                                  <button 
                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="mx-2 text-gray-500 w-6 text-center">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                  onClick={() => handleRemoveItem(item.product.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <p>Tax (10%)</p>
                  <p>${tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 mt-4 pt-4 border-t">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-purple-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-purple-700 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-purple-600 hover:text-purple-500"
                      onClick={() => dispatch(closeCart())}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShoppingCartSlideOver;