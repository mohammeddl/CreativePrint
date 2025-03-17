import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ShoppingBag, Search, Package, ChevronRight, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../components/services/api/axios";
import toast from "react-hot-toast";
import { Order } from "../../types/order";

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

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error("Please login to view your orders");
      navigate("/login");
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/history");
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || "Failed to load orders");
        toast.error("Could not load your orders");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate, isAuthenticated]);
  
  // Filter orders based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }
    
    const filtered = orders.filter(order => 
      order.id.toString().includes(searchQuery) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const getTotalItems = (order: Order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };
  
  const handleOrderClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };
  
  const handleContinueShopping = () => {
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Loading your orders...</h2>
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500">View and track your orders</p>
        </div>
        
        {orders.length > 0 ? (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search by order ID or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Orders List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6 border-b">
                <h2 className="text-lg font-medium text-gray-900">Order History</h2>
              </div>
              
              {filteredOrders.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <li 
                      key={order.id}
                      onClick={() => handleOrderClick(order.id)}
                      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-lg font-medium text-gray-900">Order #{order.id}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col md:items-end">
                          <div className="flex items-center mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">{getTotalItems(order)} items</span>
                            <span className="mx-2">•</span>
                            <span className="font-medium text-gray-900">${order.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center text-sm text-purple-600">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>View order details</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No orders found matching your search.</p>
                </div>
              )}
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
            <h2 className="text-2xl font-medium text-gray-900 mb-3">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={handleContinueShopping}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              Start Shopping
            </button>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}