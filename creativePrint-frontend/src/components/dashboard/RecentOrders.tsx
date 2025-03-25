import { Link } from "react-router-dom";
import { dashboardService } from "../services/api/dashboard.service";

interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
  date: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <Link 
          to="/dashboard/orders" 
          className="text-sm text-purple-600 hover:text-purple-800"
        >
          View all
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${dashboardService.formatCurrency(order.total)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                    ${order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' : 
                      order.status === 'IN_PRODUCTION' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{dashboardService.formatDate(order.date)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-sm text-gray-500 text-center" colSpan={5}>
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;