import { CheckCircle, MessageCircle, Truck, X } from "lucide-react";
import { Order, OrderStatusHistory } from "../../types/order";
import { orderService } from "../services/api/order.service";
import toast from "react-hot-toast";
import { calculateCommission } from "../../utils/commissionUtils";

interface OrderDetailsModalProps {
  order: Order | null;
  orderHistory: OrderStatusHistory[];
  onClose: () => void;
  onUpdateStatus: (newStatus: string, statusNote: string) => void;
  onOpenStatusModal: () => void;
  setNewStatus: (status: string) => void;
  setStatusNote: (note: string) => void;
  getAvailableStatuses: (currentStatus: string) => Array<{ value: string; label: string }>;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  orderHistory,
  onClose,
  onUpdateStatus,
  onOpenStatusModal,
  setNewStatus,
  setStatusNote,
  getAvailableStatuses
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Order #{order.id}
          </h3>
          <button 
            onClick={onClose}
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
                    <span className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${orderService.getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm text-gray-900">{orderService.formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-medium text-gray-900">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-sm font-medium text-gray-900">
                  {order.buyer.firstName} {order.buyer.lastName}
                </p>
                <p className="text-sm text-gray-500 mt-1">{order.buyer.email}</p>
              </div>
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
          <div className="bg-gray-50 rounded-md p-4 mb-6">
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
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
              {order.items.map((item, index) => {
                const basePrice = item.variant.product.basePrice + item.variant.priceAdjustment;
                const total = basePrice * item.quantity;
                
                // Calculate threshold based on product category/name
                const productName = item.variant.product.name.toLowerCase();
                const productCategory = typeof item.variant.product.category === 'string' 
                  ? item.variant.product.category.toLowerCase()
                  : item.variant.product.category.name.toLowerCase();
                
                const { commission, threshold } = calculateCommission(
                  productCategory || productName, 
                  basePrice
                );
                
                // Calculate total commission for all quantity
                const totalCommission = commission * item.quantity;
                
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
                        <span className="text-gray-500">Base Cost:</span>
                        <span className="ml-1 font-medium">${threshold.toFixed(2)} per item</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Your Commission:</span>
                        <span className="ml-1 font-medium text-green-600">
                          ${totalCommission.toFixed(2)} 
                          {basePrice > threshold ? 
                            ` (${((basePrice - threshold) * 0.7).toFixed(2)} per item)` : 
                            " (minimum price)"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
                <span className="text-sm font-medium text-gray-700">Total Commission:</span>
                <span className="text-sm font-bold text-green-600">
                  ${order.items.reduce((total, item) => {
                    const basePrice = item.variant.product.basePrice + item.variant.priceAdjustment;
                    const productCategory = typeof item.variant.product.category === 'string' 
                      ? item.variant.product.category.toLowerCase()
                      : item.variant.product.category.name.toLowerCase();
                    
                    const { commission } = calculateCommission(productCategory, basePrice);
                    return total + (commission * item.quantity);
                  }, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <div>
            {order.status === "DELIVERED" && (
              <button
                onClick={() => {
                  setNewStatus("COMPLETED");
                  setStatusNote("Order successfully delivered and completed");
                  onOpenStatusModal();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </button>
            )}
            
            {order.status === "PAYMENT_RECEIVED" && (
              <button
                onClick={() => {
                  setNewStatus("IN_PRODUCTION");
                  setStatusNote("Starting production process");
                  onOpenStatusModal();
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
              >
                <Truck className="w-4 h-4 mr-2" />
                Start Production
              </button>
            )}
            
            {getAvailableStatuses(order.status).length > 0 && 
              order.status !== "DELIVERED" && 
              order.status !== "PAYMENT_RECEIVED" && (
              <button
                onClick={onOpenStatusModal}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Update Status
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                toast.success("Message feature would open here");
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Customer
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;