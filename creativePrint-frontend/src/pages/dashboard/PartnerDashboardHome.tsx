import { useState, useEffect } from "react";
import { PlusCircle, ShoppingBag, Palette, Package, TrendingUp, Upload, CheckCircle } from "lucide-react";

const EnhancedPartnerDashboard = () => {
  const [stats, setStats] = useState({
    totalDesigns: 25,
    totalProducts: 42,
    totalOrders: 76,
    recentOrders: [
      {id: "1234", customer: "John Smith", total: 39.99, status: "SHIPPED", date: "2025-03-15"},
      {id: "1235", customer: "Alice Johnson", total: 49.50, status: "IN_PRODUCTION", date: "2025-03-18"},
      {id: "1236", customer: "Robert Davis", total: 28.95, status: "PENDING", date: "2025-03-20"}
    ],
    recentSales: [
      {date: "2025-03-15", amount: 349.50},
      {date: "2025-03-16", amount: 285.75},
      {date: "2025-03-17", amount: 420.25},
      {date: "2025-03-18", amount: 375.00},
      {date: "2025-03-19", amount: 425.50},
      {date: "2025-03-20", amount: 490.25}
    ],
    categorySales: [
      { category: "T-shirts", totalSales: 1250.50, totalItems: 45, avgPrice: 27.79 },
      { category: "Hats", totalSales: 680.25, totalItems: 32, avgPrice: 21.26 },
      { category: "Mugs", totalSales: 425.75, totalItems: 38, avgPrice: 11.20 }
    ]
  });
  const [loading, setLoading] = useState(false);

  // Function to calculate partner commission based on product category and price
  const calculateCommission = (category, price) => {
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
  const formatCurrency = (amount) => {
    return amount.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
        <div className="flex space-x-3">
          <button 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Design
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Palette className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Designs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalDesigns}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button 
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              View all
            </button>
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${formatCurrency(order.total)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                        ${order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' : 
                          order.status === 'IN_PRODUCTION' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {order.status === 'SHIPPED' && (
                        <button 
                          className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium hover:bg-green-100"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
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

        {/* Sales Overview - Enhanced with Category Commission Display */}
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
                {stats.categorySales?.map((category, index) => {
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
                {(!stats.categorySales || stats.categorySales.length === 0) && (
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
          {stats.recentSales.length > 0 ? (
            <div className="h-48 flex items-end space-x-2">
              {stats.recentSales.map((item, index) => {
                const maxAmount = Math.max(...stats.recentSales.map(s => s.amount));
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
      </div>
    </div>
  );
};

export default EnhancedPartnerDashboard;