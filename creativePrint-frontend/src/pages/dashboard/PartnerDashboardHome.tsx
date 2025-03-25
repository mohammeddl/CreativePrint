import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Upload } from "lucide-react";
import { dashboardService, DashboardStats as ApiDashboardStats } from "../../components/services/api/dashboard.service";
import { calculateCommission } from "../../utils/commissionUtils";

// Import dashboard components
import DashboardStats from "../../components/dashboard/DashboardStats";
import RecentOrders from "../../components/dashboard/RecentOrders";
import CommissionGuide from "../../components/dashboard/CommissionGuide";

export default function PartnerDashboardHome() {
  const [stats, setStats] = useState<ApiDashboardStats>({
    totalDesigns: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentOrders: [],
    recentSales: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardService.getPartnerDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
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

      {/* Using the DashboardStats component */}
      <DashboardStats 
        totalDesigns={stats.totalDesigns} 
        totalProducts={stats.totalProducts} 
        totalOrders={stats.totalOrders} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Using the RecentOrders component */}
        <RecentOrders orders={stats.recentOrders} />

        {/* Using the CommissionGuide component */}
        <CommissionGuide calculateCommission={(basePrice, category) => {
          const categoryLower = category.toLowerCase();
          return calculateCommission(basePrice, categoryLower);
        }} />
      </div>

      {/* Sales Overview Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
        </div>
        
        {stats.recentSales.length > 0 ? (
          <div className="h-64 flex items-end space-x-2">
            {stats.recentSales.map((item, index) => {
              const maxAmount = Math.max(...stats.recentSales.map(s => s.amount));
              return (
                <div key={index} className="relative flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-colors"
                    style={{ 
                      height: `${(item.amount / maxAmount) * 180}px` 
                    }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left absolute -bottom-6">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-xs font-medium absolute -top-6">
                    ${dashboardService.formatCurrency(item.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">No sales data available</p>
          </div>
        )}
      </div>
    </div>
  );
}