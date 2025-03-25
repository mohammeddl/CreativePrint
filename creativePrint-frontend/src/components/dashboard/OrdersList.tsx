import { CheckCircle, Eye, ShoppingBag, Truck } from "lucide-react";
import { Order } from "../../types/order";
import { orderService } from "../services/api/order.service";

interface OrdersListProps {
  orders: Order[] | undefined;
  loading: boolean;
  onViewOrder: (order: Order) => void;
  onMarkAsCompleted: (orderId: number) => void;
  onStartProduction: (order: Order) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders = [], // Default to empty array if undefined
  loading,
  onViewOrder,
  onMarkAsCompleted,
  onStartProduction
}) => {
  // Make sure orders is an array before attempting to use array methods
  const orderArray = Array.isArray(orders) ? orders : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (!orderArray.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-sm text-gray-500">
          When customers purchase products with your designs, they'll appear here
        </p>
      </div>
    );
  }

  return (
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
          {orderArray.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.buyer.firstName} {order.buyer.lastName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.items?.length || 0} {(order.items?.length || 0) === 1 ? 'item' : 'items'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${order.totalPrice?.toFixed(2) || '0.00'}
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
                  onClick={() => onViewOrder(order)}
                  className="text-indigo-600 hover:text-indigo-900"
                  title="View Order Details"
                >
                  <Eye className="h-5 w-5" />
                </button>
                
                {/* Show completed button for DELIVERED orders */}
                {order.status === "DELIVERED" && (
                  <button
                    onClick={() => onMarkAsCompleted(order.id)}
                    className="text-green-600 hover:text-green-900"
                    title="Mark as Completed"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
                
                {/* Show production button for PAYMENT_RECEIVED orders */}
                {order.status === "PAYMENT_RECEIVED" && (
                  <button
                    onClick={() => onStartProduction(order)}
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
  );
};

export default OrdersList;