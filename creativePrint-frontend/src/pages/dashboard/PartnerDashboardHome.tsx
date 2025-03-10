import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { PlusCircle, ShoppingBag, Palette, Package, TrendingUp, Upload } from "lucide-react"
import { RootState } from "../../store/store"
import { api } from "../../components/services/api/axios"

interface DashboardStats {
  totalDesigns: number
  totalProducts: number
  totalOrders: number
  recentOrders: any[]
  recentSales: { date: string; amount: number }[]
}

export default function PartnerDashboardHome() {
  const { currentUser } = useSelector((state: RootState) => state.user)
  const [stats, setStats] = useState<DashboardStats>({
    totalDesigns: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: [],
    recentSales: []
  })
  const [loading, setLoading] = useState(true)

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        
        // For now, simulate API calls with mock data
        // In a production app, you would call the actual endpoints
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        setStats({
          totalDesigns: 12,
          totalProducts: 25,
          totalOrders: 8,
          recentOrders: [
            { id: 1, customer: "John Smith", total: 49.99, status: "SHIPPED", date: "2025-03-08" },
            { id: 2, customer: "Emily Johnson", total: 75.50, status: "IN_PRODUCTION", date: "2025-03-07" },
            { id: 3, customer: "Michael Brown", total: 34.99, status: "PAYMENT_RECEIVED", date: "2025-03-06" }
          ],
          recentSales: [
            { date: "2025-03-05", amount: 150 },
            { date: "2025-03-06", amount: 220 },
            { date: "2025-03-07", amount: 175 },
            { date: "2025-03-08", amount: 310 },
            { date: "2025-03-09", amount: 195 }
          ]
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
        <div className="flex space-x-3">
          <Link 
            to="/dashboard/designs/new" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Design
          </Link>
          <Link 
            to="/dashboard/products/new" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Product
          </Link>
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
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">#{order.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full
                        ${order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' : 
                          order.status === 'IN_PRODUCTION' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{order.date}</td>
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          
          <div className="h-64 flex items-end space-x-2">
            {stats.recentSales.map((item, index) => (
              <div key={index} className="relative flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-colors"
                  style={{ 
                    height: `${(item.amount / Math.max(...stats.recentSales.map(s => s.amount))) * 180}px` 
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left absolute -bottom-6">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs font-medium absolute -top-6">
                  ${item.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}