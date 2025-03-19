import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ArrowLeft, Package, Truck, CheckCircle, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../components/services/api/axios";
import toast from "react-hot-toast";
import { Order, OrderStatusHistory } from "../../types/order";

// Helper function to get status badge color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "PENDING":
    case "PENDING_PAYMENT":
      return "bg-yellow-100 text-yellow-800";
    case "PAYMENT_RECEIVED":
      return "bg-blue-100 text-blue-800";
    case "IN_PRODUCTION":
      return "bg-purple-100 text-purple-800";
    case "SHIPPED":
      return "bg-indigo-100 text-indigo-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
    case "REFUNDED":
      return "bg-red-100 text-red-800";
    case "PAYMENT_FAILED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get status icon
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "PENDING":
    case "PENDING_PAYMENT":
      return <Clock className="h-5 w-5" />;
    case "PAYMENT_RECEIVED":
      return <CheckCircle className="h-5 w-5" />;
    case "IN_PRODUCTION":
      return <Package className="h-5 w-5" />;
    case "SHIPPED":
      return <Truck className="h-5 w-5" />;
    case "DELIVERED":
      return <CheckCircle className="h-5 w-5" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error("Please login to view your orders");
      navigate("/login");
      return;
    }
    
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Fetch order details
        const orderResponse = await api.get(`/orders/${orderId}`);
        setOrder(orderResponse.data);
        console.log("Order details:", orderResponse.data);
        
        // Fetch order status history
        const historyResponse = await api.get(`/orders/${orderId}/status-history`);
        setOrderHistory(historyResponse.data);
      } catch (err: any) {
        console.error("Error fetching order details:", err);
        setError(err.response?.data?.message || "Failed to load order details");
        toast.error("Could not load order details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId, navigate, isAuthenticated]);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Loading order details...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !order) {
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
            <h2 className="text-2xl font-medium text-gray-900 mb-3">Order Not Found</h2>
            <p className="text-gray-500 mb-6">{error || "The requested order could not be found."}</p>
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status and Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-medium">#{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Date</span>
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-medium">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Order Status Timeline */}
              <div className="p-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Order Status History</h3>
                <div className="space-y-4">
                  {orderHistory.length > 0 ? (
                    orderHistory.map((history, index) => (
                      <div key={history.id} className="relative pb-6">
                        {index < orderHistory.length - 1 && (
                          <div className="absolute left-4 top-8 -ml-0.5 h-full w-0.5 bg-gray-200"></div>
                        )}
                        <div className="relative flex items-start">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getStatusColor(history.status)} ring-4 ring-white`}>
                            <StatusIcon status={history.status} />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{history.status.replace(/_/g, ' ')}</p>
                            {history.notes && (
                              <p className="text-sm text-gray-500 mt-0.5">{history.notes}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(history.timestamp)} • {history.updatedByName}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No status history available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Order Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-lg shadow-md"
            >
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <li key={item.id} className="p-6 flex">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.design.designUrl || "../../../public/assets/images/default-avatar.png"}
                        alt={item.variant.product?.name || "Product"}
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
                          <h3>{item.variant.product?.name || "Product"}</h3>
                          <p className="ml-4">
                            ${((item.variant.product?.basePrice || 0) + (item.variant.priceAdjustment || 0)).toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.variant.color || "Default"} / {item.variant.size || "One Size"}
                        </p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                        <p className="font-medium text-gray-900">
                          ${(((item.variant.product?.basePrice || 0) + (item.variant.priceAdjustment || 0)) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="p-6 border-t">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Total</p>
                  <p>${order.totalPrice.toFixed(2)}</p>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => navigate("/home")}
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}