import { Palette, Package, ShoppingBag } from "lucide-react";

interface DashboardStatsProps {
  totalDesigns: number;
  totalProducts: number;
  totalOrders: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  totalDesigns, 
  totalProducts, 
  totalOrders 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Palette className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Designs</p>
          <p className="text-2xl font-bold text-gray-900">{totalDesigns}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
        <div className="p-3 bg-green-100 rounded-lg">
          <ShoppingBag className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;