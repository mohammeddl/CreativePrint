import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  removeFromCart, 
  updateQuantity, 
//   clearCart 
} from "../../store/slices/cartSlice";
import { RootState } from "../../store/store";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ArrowLeft, Trash2, ShoppingBag, Plus, Minus, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../components/services/api/axios";
import toast from "react-hot-toast";

interface OrderItem {
  variantId: number;
  quantity: number;
}

export default function ShoppingCartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { userId, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.product.price || item.product.basePrice || 0;
    return sum + itemPrice * item.quantity;
  }, 0);
  
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + tax + shipping;
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated && items.length > 0) {
      toast.error("Please login to continue shopping");
      navigate("/login");
    }
  }, [isAuthenticated, items.length, navigate]);
  
  const handleQuantityChange = (productId: string | number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };
  
  const handleRemoveItem = (productId: string | number) => {
    dispatch(removeFromCart(productId));
  };
  
  const handleContinueShopping = () => {
    navigate("/home");
  };
  
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
      const orderItems: OrderItem[] = items.map(item => ({
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
        returnUrl: window.location.origin + "/payment/success",
        cancelUrl: window.location.origin + "/cart"
      };
      
      const paymentResponse = await api.post("/payments/paypal/create", paymentRequest);
      
      // 3. Redirect to PayPal approval URL
      if (paymentResponse.data.approvalUrl) {
        window.location.href = paymentResponse.data.approvalUrl;
      } else {
        throw new Error("No PayPal approval URL received");
      }
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Error processing checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.product.id} className="py-6 flex">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.product.image || item.product.design?.designUrl || "../../../public/assets/images/default-avatar.png"}
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
                              <p className="ml-4">
                                ${((item.product.price || item.product.basePrice || 0) * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.product.variants?.[0]?.color || "Default"} / {item.product.variants?.[0]?.size || "One Size"}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 rounded-l-md"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 py-2 border-x">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 rounded-r-md"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.product.id)}
                                className="font-medium text-red-600 hover:text-red-500 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base">
                    <p>Tax (10%)</p>
                    <p>${tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base">
                    <p>Shipping</p>
                    <p>{shipping > 0 ? `$${shipping.toFixed(2)}` : "Free"}</p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-medium">
                      <p>Total</p>
                      <p>${total.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes and shipping fees
                    </p>
                  </div>
                  <button
                    onClick={initiatePayPalCheckout}
                    disabled={isProcessing || items.length === 0}
                    className={`w-full mt-6 ${
                      isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    } text-white py-3 px-4 rounded-md font-medium flex items-center justify-center`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Checkout with PayPal
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="w-full mt-2 border border-gray-300 py-3 px-4 rounded-md font-medium hover:bg-gray-50 flex items-center justify-center"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Continue Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-10 text-center"
          >
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 mb-5">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <button
              onClick={handleContinueShopping}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              Continue Shopping
            </button>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}