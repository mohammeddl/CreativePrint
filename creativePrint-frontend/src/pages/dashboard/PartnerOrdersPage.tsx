import { useState, useEffect } from "react"
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  Eye, 
  RefreshCw,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
  Truck,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { orderService, ORDER_STATUSES } from "../../components/services/api/order.service"
import { Order, OrderStatusHistory } from "../../types/order"
import toast from "react-hot-toast"

export default function PartnerOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistory[]>([])
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")
  const [viewMode, setViewMode] = useState<"orders" | "sales">("orders")

  // Category sales data for commission display
  const [categorySales, setCategorySales] = useState([
    { category: "T-shirts", totalSales: 1250.50, totalItems: 45, avgPrice: 27.79 },
    { category: "Hats", totalSales: 680.25, totalItems: 32, avgPrice: 21.26 },
    { category: "Mugs", totalSales: 425.75, totalItems: 38, avgPrice: 11.20 }
  ])

  // Recent Sales data
  const [recentSales, setRecentSales] = useState([
    {date: "2025-03-15", amount: 349.50},
    {date: "2025-03-16", amount: 285.75},
    {date: "2025-03-17", amount: 420.25},
    {date: "2025-03-18", amount: 375.00},
    {date: "2025-03-19", amount: 425.50},
    {date: "2025-03-20", amount: 490.25}
  ])
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        // This would normally be from your API
        const response = await orderService.getOrders({
          page,
          size: 10,
          search: searchQuery,
          status: filterStatus
        })
        
        setOrders(response.content || [])
        setTotalPages(response.totalPages || 0)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast.error("Failed to load orders")
        
        // Fallback data for development
        setOrders([
          {
            id: 1001,
            buyer: { id: 1, firstName: "John", lastName: "Smith", email: "john@example.com" },
            items: [
              { 
                id: 1, 
                variant: { 
                  id: 1,
                  size: "L", 
                  color: "Black", 
                  product: { 
                    id: 101,
                    name: "Premium T-Shirt", 
                    basePrice: 24.99,
                    description: "",
                    category: "T-shirts",
                    image: ""
                  },
                  priceAdjustment: 2,
                  stock: 10
                }, 
                quantity: 2 
              }
            ],
            totalPrice: 53.98,
            status: "SHIPPED",
            createdAt: "2025-03-10T14:30:00Z"
          },
          {
            id: 1002,
            buyer: { id: 2, firstName: "Alice", lastName: "Johnson", email: "alice@example.com" },
            items: [
              { 
                id: 2, 
                variant: { 
                  id: 2,
                  size: "M", 
                  color: "Blue", 
                  product: { 
                    id: 102,
                    name: "Classic Hat", 
                    basePrice: 18.99,
                    description: "",
                    category: "Hats",
                    image: ""
                  },
                  priceAdjustment: 0,
                  stock: 15
                }, 
                quantity: 1 
              },
              { 
                id: 3, 
                variant: { 
                  id: 3,
                  size: "One Size", 
                  color: "White", 
                  product: { 
                    id: 103,
                    name: "Coffee Mug", 
                    basePrice: 12.99,
                    description: "",
                    category: "Mugs",
                    image: ""
                  },
                  priceAdjustment: 0,
                  stock: 20
                }, 
                quantity: 2 
              }
            ],
            totalPrice: 44.97,
            status: "IN_PRODUCTION",
            createdAt: "2025-03-15T09:45:00Z"
          },
          {
            id: 1003,
            buyer: { id: 3, firstName: "Robert", lastName: "Davis", email: "robert@example.com" },
            items: [
              { 
                id: 4, 
                variant: { 
                  id: 4,
                  size: "XL", 
                  color: "Gray", 
                  product: { 
                    id: 104,
                    name: "Vintage T-Shirt", 
                    basePrice: 22.99,
                    description: "",
                    category: "T-shirts",
                    image: ""
                  },
                  priceAdjustment: 3,
                  stock: 8
                }, 
                quantity: 1 
              }
            ],
            totalPrice: 25.99,
            status: "PAYMENT_RECEIVED",
            createdAt: "2025-03-18T16:20:00Z"
          },
          {
            id: 1004,
            buyer: { id: 4, firstName: "Emily", lastName: "Wilson", email: "emily@example.com" },
            items: [
              { 
                id: 5, 
                variant: { 
                  id: 5,
                  size: "S", 
                  color: "Red", 
                  product: { 
                    id: 105,
                    name: "Baseball Cap", 
                    basePrice: 15.99,
                    description: "",
                    category: "Hats",
                    image: ""
                  },
                  priceAdjustment: 0,
                  stock: 12
                }, 
                quantity: 2 
              }
            ],
            totalPrice: 31.98,
            status: "DELIVERED",
            createdAt: "2025-03-05T11:15:00Z"
          }
        ])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [page, searchQuery, filterStatus])
  
  // Fetch order history when an order is selected
  useEffect(() => {
    if (!selectedOrder) return
    
    const fetchOrderHistory = async () => {
      try {
        const historyData = await orderService.getOrderStatusHistory(selectedOrder.id)
        setOrderHistory(historyData)
      } catch (error) {
        console.error("Error fetching order history:", error)
        // Fallback mock data
        setOrderHistory([
          {
            id: 101,
            orderId: selectedOrder.id,
            status: selectedOrder.status,
            notes: "Current status",
            updatedByName: "System",
            timestamp: new Date().toISOString()
          },
          {
            id: 100,
            orderId: selectedOrder.id,
            status: "PAYMENT_RECEIVED",
            notes: "Payment confirmed",
            updatedByName: "System",
            timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
          }
        ])
      }
    }
    
    fetchOrderHistory()
  }, [selectedOrder])
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(0) 
  }
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value)
    setPage(0) 
  }
  
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
  }
  
  const closeOrderDetails = () => {
    setSelectedOrder(null)
    setOrderHistory([])
  }
  
  const openStatusUpdateModal = () => {
    if (!selectedOrder) return
    setNewStatus(selectedOrder.status)
    setStatusNote("")
    setShowStatusModal(true)
  }
  
  const closeStatusUpdateModal = () => {
    setShowStatusModal(false)
    setNewStatus("")
    setStatusNote("")
  }
  
  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return
    
    setIsUpdatingStatus(true)
    
    try {
      // In a real app, this would call your API to update status
      /* await orderService.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        notes: statusNote
      }) */
      
      // Update local order status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === selectedOrder.id ? { ...order, status: newStatus } : order
        )
      )
      
      // Add to history
      const newHistoryEntry: OrderStatusHistory = {
        id: Math.floor(Math.random() * 1000), 
        orderId: selectedOrder.id,
        status: newStatus,
        notes: statusNote,
        updatedByName: "You", 
        timestamp: new Date().toISOString()
      }
      
      setOrderHistory([newHistoryEntry, ...orderHistory])
      setSelectedOrder({ ...selectedOrder, status: newStatus })
      
      closeStatusUpdateModal()
      toast.success("Order status updated successfully")
    } catch (error) {
      console.error("Error updating order status:", error)
      toast.error("Failed to update order status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }
  
  // Function to mark an order as "COMPLETED" directly from the order list
  const markAsCompleted = async (orderId: number) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local order status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: "COMPLETED" } : order
        )
      );
      
      toast.success(`Order #${orderId} marked as COMPLETED`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };
  
  // Get available next statuses for the order
  const getAvailableStatuses = (currentStatus: string) => {
    // Define allowed status transitions
    const transitionMap: {[key: string]: string[]} = {
      "PENDING": ["PENDING_PAYMENT", "CANCELLED"],
      "PENDING_PAYMENT": ["PAYMENT_RECEIVED", "PAYMENT_FAILED", "CANCELLED"],
      "PAYMENT_RECEIVED": ["IN_PRODUCTION", "CANCELLED", "REFUNDED"],
      "PAYMENT_FAILED": ["PENDING_PAYMENT", "CANCELLED"],
      "IN_PRODUCTION": ["SHIPPED", "CANCELLED"],
      "SHIPPED": ["DELIVERED", "REFUNDED"],
      "DELIVERED": ["COMPLETED", "REFUNDED"],
      "COMPLETED": [],
      "CANCELLED": [],
      "REFUNDED": []
    };
    
    return ORDER_STATUSES.filter(status => 
      transitionMap[currentStatus]?.includes(status.value)
    );
  }

  // Function to calculate partner commission based on product category and price
  const calculateCommission = (category: string, price: number) => {
    let threshold = 0;
    let commissionRate = 0.7; // Default 70% commission rate
    
    // Set threshold based on category
    if (category.toLowerCase().includes("shirt")) {
      threshold = 14;
    } else if (category.toLowerCase().includes("hat")) {
      threshold = 8;
    } else if (category.toLowerCase().includes("mug")) {
      threshold = 7;
    }
    
    // Calculate commission for amount above threshold
    let commission = price * commissionRate;
    let platformFee = price - commission;
    
    // Add special note if price is at or below threshold
    let note = price > threshold ? 
      `${(commissionRate * 100).toFixed(0)}% commission` : 
      "Minimum price - low commission";
    
    return { commission, platformFee, note };
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Main header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div className="bg-white p-2 rounded-lg shadow-sm flex space-x-2">
        <button
          onClick={() => setViewMode("orders")}
          className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
            viewMode === "orders" 
              ? "bg-purple-100 text-purple-700" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Orders
        </button>
        <button
          onClick={() => setViewMode("sales")}
          className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
            viewMode === "sales" 
              ? "bg-purple-100 text-purple-700" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Sales & Commissions
        </button>
      </div>
      
      {viewMode === "sales" ? (
        <>
          {/* Sales Overview - Category Commission Display */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            
            {/* Category Sales Table */}
            <div className="mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Price
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categorySales?.map((category, index) => {
                    const { commission, platformFee, note } = calculateCommission(
                      category.category, 
                      category.avgPrice
                    );
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.category}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                          ${category.totalSales.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                          {category.totalItems}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                          ${category.avgPrice.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-medium text-green-600">${commission.toFixed(2)}</span>
                            <span className="text-xs text-gray-500">{note}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {(!categorySales || categorySales.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-sm text-center text-gray-500">
                        No category sales data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Chart visualization */}
            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Sales Trend</h3>
            {recentSales.length > 0 ? (
              <div className="h-48 flex items-end space-x-2">
                {recentSales.map((item, index) => {
                  const maxAmount = Math.max(...recentSales.map(s => s.amount));
                  return (
                    <div key={index} className="relative flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-colors"
                        style={{ 
                          height: `${(item.amount / maxAmount) * 140}px` 
                        }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left absolute -bottom-6">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs font-medium absolute -top-6">
                        ${formatCurrency(item.amount)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
            
            {/* Pricing Guide */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Partner Commission Guide</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="font-medium text-blue-700">T-shirts</p>
                  <p className="text-blue-600">Min. price: $14.00</p>
                  <p className="text-gray-500">70% commission above minimum</p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="font-medium text-green-700">Hats</p>
                  <p className="text-green-600">Min. price: $8.00</p>
                  <p className="text-gray-500">70% commission above minimum</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="font-medium text-purple-700">Mugs</p>
                  <p className="text-purple-600">Min. price: $7.00</p>
                  <p className="text-gray-500">70% commission above minimum</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Orders view */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Orders</h2>
          </div>
          
          {/* Search and filter section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            {/* Filter by Status */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                {ORDER_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Orders list */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.buyer.firstName} {order.buyer.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${orderService.getStatusColor(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {orderService.formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-2">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Order Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        
                        {/* Show completed button for DELIVERED orders */}
                        {order.status === "DELIVERED" && (
                          <button
                            onClick={() => markAsCompleted(order.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        
                        {/* Show production button for PAYMENT_RECEIVED orders */}
                        {order.status === "PAYMENT_RECEIVED" && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus("IN_PRODUCTION");
                              setStatusNote("Moving to production phase");
                              setShowStatusModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                            title="Move to Production"
                          >
                            <Truck className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-sm text-gray-500">
                {searchQuery || filterStatus 
                  ? "Try adjusting your search or filter" 
                  : "When customers purchase products with your designs, they'll appear here"}
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className={`px-3 py-1 rounded-md ${page === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`px-3 py-1 rounded-md ${page === i ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className={`px-3 py-1 rounded-md ${page === totalPages - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
        
        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Order #{selectedOrder.id}
                </h3>
                <button 
                  onClick={closeOrderDetails}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Order Information</h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <span className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${orderService.getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm text-gray-900">{orderService.formatDate(selectedOrder.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-sm font-medium text-gray-900">${selectedOrder.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.buyer.firstName} {selectedOrder.buyer.lastName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{selectedOrder.buyer.email}</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                <div className="bg-gray-50 rounded-md p-4 mb-6">
                  <ul className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item) => (
                      <li key={item.id} className="py-3 flex first:pt-0 last:pb-0">
                        <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.variant.product?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.variant.size}, {item.variant.color}
                          </p>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-xs font-medium text-gray-900">
                              ${item.variant.product ? ((item.variant.product.basePrice + item.variant.priceAdjustment) * item.quantity).toFixed(2) : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <h4 className="text-sm font-medium text-gray-700 mb-2">Order Status History</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {orderHistory.map((history) => (
                      <li key={history.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${orderService.getStatusColor(history.status)}`}>
                            {history.status.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {orderService.formatDate(history.timestamp)}
                          </span>
                        </div>
                        {history.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            {history.notes}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Updated by: {history.updatedByName}
                        </p>
                      </li>
                    ))}
                    {orderHistory.length === 0 && (
                      <li className="py-3 text-center text-sm text-gray-500">
                        No status history available
                      </li>
                    )}
                  </ul>
                </div>
                
                {/* Commission calculation information */}
                <h4 className="text-sm font-medium text-gray-700 mb-2 mt-6">Commission Details</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => {
                      const basePrice = item.variant.product.basePrice + item.variant.priceAdjustment;
                      const total = basePrice * item.quantity;
                      
                      // Calculate threshold based on product category/name
                      let threshold = 0;
                      const productName = item.variant.product.name.toLowerCase();
                      
                      if (productName.includes("shirt") || productName.includes("t-shirt")) {
                        threshold = 14;
                      } else if (productName.includes("hat") || productName.includes("cap")) {
                        threshold = 8;
                      } else if (productName.includes("mug")) {
                        threshold = 7;
                      }
                      
                      // Calculate commission (70% of item price)
                      const commissionRate = 0.7;
                      const commission = total * commissionRate;
                      const platformFee = total - commission;
                      
                      return (
                        <div key={index} className="p-2 bg-white rounded border border-gray-100">
                          <p className="text-sm font-medium text-gray-800">
                            {item.variant.product.name} ({item.quantity} x ${basePrice.toFixed(2)})
                          </p>
                          <div className="mt-1 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Total Price:</span>
                              <span className="ml-1 font-medium">${total.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Platform Fee:</span>
                              <span className="ml-1 font-medium">${platformFee.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Your Commission:</span>
                              <span className="ml-1 font-medium text-green-600">${commission.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Rate:</span>
                              <span className="ml-1 font-medium">
                                {basePrice > threshold ? 
                                  `${(commissionRate * 100).toFixed(0)}%` : 
                                  `${(commissionRate * 100).toFixed(0)}% (min. price: ${threshold})`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
                      <span className="text-sm font-medium text-gray-700">Total Commission:</span>
                      <span className="text-sm font-bold text-green-600">
                        ${selectedOrder.items.reduce((total, item) => {
                          const itemTotal = (item.variant.product.basePrice + item.variant.priceAdjustment) * item.quantity;
                          return total + (itemTotal * 0.7); // 70% commission
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t flex justify-between">
                <div>
                  {selectedOrder.status === "DELIVERED" && (
                    <button
                      onClick={() => {
                        setNewStatus("COMPLETED");
                        setStatusNote("Order successfully delivered and completed");
                        setShowStatusModal(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </button>
                  )}
                  
                  {selectedOrder.status === "PAYMENT_RECEIVED" && (
                    <button
                      onClick={() => {
                        setNewStatus("IN_PRODUCTION");
                        setStatusNote("Starting production process");
                        setShowStatusModal(true);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Start Production
                    </button>
                  )}
                  
                  {getAvailableStatuses(selectedOrder.status).length > 0 && 
                    selectedOrder.status !== "DELIVERED" && 
                    selectedOrder.status !== "PAYMENT_RECEIVED" && (
                    <button
                      onClick={openStatusUpdateModal}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Update Status
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      // Simulate sending message functionality
                      toast.success("Message feature would open here");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Customer
                  </button>
                  <button
                    onClick={closeOrderDetails}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Update Order Status
                </h3>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label htmlFor="newStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    New Status
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select New Status</option>
                    {getAvailableStatuses(selectedOrder.status).map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="statusNote" className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optional)
                  </label>
                  <textarea
                    id="statusNote"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Add a note about this status update"
                  />
                </div>
                
                {newStatus === 'SHIPPED' && (
                  <div className="mb-4 bg-blue-50 p-4 rounded-md text-sm text-blue-700 flex">
                    <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium">Shipping Notice:</p>
                      <p className="mt-1">Make sure to provide tracking information to the customer after shipping.</p>
                    </div>
                  </div>
                )}
                
                {newStatus === 'COMPLETED' && (
                  <div className="mb-4 bg-green-50 p-4 rounded-md text-sm text-green-700 flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium">Order Complete:</p>
                      <p className="mt-1">Marking this order as completed will finalize the order process. This indicates the customer has received their items successfully.</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t flex justify-end space-x-3">
                <button
                  onClick={closeStatusUpdateModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  disabled={isUpdatingStatus}
                >
                  Cancel
                </button>
                <button
                  onClick={updateOrderStatus}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  disabled={isUpdatingStatus || !newStatus}
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Status</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }