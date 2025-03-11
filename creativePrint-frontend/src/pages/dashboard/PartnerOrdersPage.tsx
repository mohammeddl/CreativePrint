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
  AlertTriangle
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
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
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
      }
    }
    
    fetchOrderHistory()
  }, [selectedOrder])
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(0) // Reset page when search changes
  }
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value)
    setPage(0) // Reset page when filter changes
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
      await orderService.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        notes: statusNote
      })
      
      // Update local order status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === selectedOrder.id ? { ...order, status: newStatus } : order
        )
      )
      
      // Add to history
      const newHistoryEntry: OrderStatusHistory = {
        id: Math.floor(Math.random() * 1000), // Temporary ID
        orderId: selectedOrder.id,
        status: newStatus,
        notes: statusNote,
        updatedByName: "You", // Would be set server-side in a real app
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
  
  // Get available next statuses for the order
  const getAvailableStatuses = (currentStatus: string) => {
    return ORDER_STATUSES.filter(status => 
      orderService.canUpdateToStatus(currentStatus, status.value)
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
      
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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
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
            </div>
            
            <div className="p-4 border-t flex justify-between">
              <div>
                {getAvailableStatuses(selectedOrder.status).length > 0 && (
                  <button
                    onClick={openStatusUpdateModal}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    Update Status
                  </button>
                )}
              </div>
              <button
                onClick={closeOrderDetails}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
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
              
              {newStatus === 'DELIVERED' && (
                <div className="mb-4 bg-green-50 p-4 rounded-md text-sm text-green-700 flex">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">Order Complete:</p>
                    <p className="mt-1">Marking this order as delivered will complete the fulfillment process.</p>
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
  )
}