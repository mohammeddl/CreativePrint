import { useState, useEffect } from "react";
import { Search, X, Eye, CheckCircle, ShoppingBag } from "lucide-react";
import { orderService, ORDER_STATUSES } from "../../components/services/api/order.service";
import { Order, OrderStatusHistory } from "../../types/order";
import toast from "react-hot-toast";
import OrderDetailsModal from "../../components/dashboard/OrderDetailsModal";
import OrderStatusModal from "../../components/dashboard/OrderStatusModal";
import OrderSearchFilter from "../../components/dashboard/OrderSearchFilter";
import OrdersList from "../../components/dashboard/OrdersList";

export default function PartnerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderStatusHistory[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [searchQuery, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      
      // Handle both array and paginated response formats
      let responseData = Array.isArray(response) ? response : 
                        (response.content ? response.content : []);
      
      // Apply filters client-side if search or status filters are active
      let filteredOrders = responseData;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(
          order => 
            order.id.toString().includes(query) || 
            `${order.buyer.firstName} ${order.buyer.lastName}`.toLowerCase().includes(query)
        );
      }
      
      if (filterStatus) {
        filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // When an order is selected, fetch its history
  useEffect(() => {
    if (!selectedOrder) return;
    
    const fetchOrderHistory = async () => {
      try {
        const historyData = await orderService.getOrderStatusHistory(selectedOrder.id);
        setOrderHistory(historyData);
      } catch (error) {
        console.error("Error fetching order history:", error);
        setOrderHistory([]);
      }
    };
    
    fetchOrderHistory();
  }, [selectedOrder]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };
  
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };
  
  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setOrderHistory([]);
  };
  
  const openStatusUpdateModal = () => {
    if (!selectedOrder) return;
    setNewStatus(selectedOrder.status);
    setStatusNote("");
    setShowStatusModal(true);
  };
  
  const closeStatusUpdateModal = () => {
    setShowStatusModal(false);
    setNewStatus("");
    setStatusNote("");
  };
  
  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setIsUpdatingStatus(true);
    
    try {
      // In a real application, this would call your API
      // const response = await orderService.updateOrderStatus(selectedOrder.id, {
      //   status: newStatus,
      //   notes: statusNote
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local order status
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === selectedOrder.id ? { ...order, status: newStatus } : order
        )
      );
      
      // Add to history
      const newHistoryEntry: OrderStatusHistory = {
        id: Math.floor(Math.random() * 1000), 
        orderId: selectedOrder.id,
        status: newStatus,
        notes: statusNote,
        updatedByName: "You", 
        timestamp: new Date().toISOString()
      };
      
      setOrderHistory([newHistoryEntry, ...orderHistory]);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      
      closeStatusUpdateModal();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
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
  
  // Function to move an order to production
  const startProduction = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus("IN_PRODUCTION");
    setStatusNote("Starting production process");
    setShowStatusModal(true);
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>
      
      {/* Search and filter */}
      <OrderSearchFilter 
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearSearch={() => setSearchQuery("")}
        statusOptions={ORDER_STATUSES}
      />
      
      {/* Orders list */}
      <OrdersList 
        orders={orders}
        loading={loading}
        onViewOrder={openOrderDetails}
        onMarkAsCompleted={markAsCompleted}
        onStartProduction={startProduction}
      />
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          orderHistory={orderHistory}
          onClose={closeOrderDetails}
          onUpdateStatus={updateOrderStatus}
          onOpenStatusModal={openStatusUpdateModal}
          setNewStatus={setNewStatus}
          setStatusNote={setStatusNote}
          getAvailableStatuses={getAvailableStatuses}
        />
      )}
      
      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <OrderStatusModal 
          isOpen={showStatusModal}
          onClose={closeStatusUpdateModal}
          currentStatus={selectedOrder.status}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          statusNote={statusNote} 
          setStatusNote={setStatusNote}
          onUpdateStatus={updateOrderStatus}
          isUpdating={isUpdatingStatus}
          availableStatuses={getAvailableStatuses(selectedOrder.status)}
        />
      )}
    </div>
  );
}