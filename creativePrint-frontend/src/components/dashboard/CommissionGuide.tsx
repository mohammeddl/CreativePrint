import { TrendingUp } from "lucide-react";

interface CommissionGuideProps {
  calculateCommission: (basePrice: number, category: string) => {
    commission: number;
    threshold: number;
  };
}

const CommissionGuide: React.FC<CommissionGuideProps> = ({ calculateCommission }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Commission Guide</h2>
        <TrendingUp className="w-5 h-5 text-green-600" />
      </div>
      
      <p className="text-sm text-gray-700 mb-4">
        Your commission is 70% of the price above base cost thresholds:
      </p>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-700 mb-2">T-shirts</h3>
          <p className="text-sm">Base cost: <span className="font-semibold text-blue-800">$14.00</span></p>
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span>Product Price:</span>
              <span>$20.00</span>
            </div>
            <div className="flex justify-between text-blue-800 font-medium">
              <span>Your Commission:</span>
              <span>${calculateCommission(20, "t-shirt").commission.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-blue-600 text-center text-xs">
              (70% of amount above $14)
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-medium text-green-700 mb-2">Hats</h3>
          <p className="text-sm">Base cost: <span className="font-semibold text-green-800">$8.00</span></p>
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span>Product Price:</span>
              <span>$15.00</span>
            </div>
            <div className="flex justify-between text-green-800 font-medium">
              <span>Your Commission:</span>
              <span>${calculateCommission(15, "hat").commission.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-green-600 text-center text-xs">
              (70% of amount above $8)
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium text-purple-700 mb-2">Mugs</h3>
          <p className="text-sm">Base cost: <span className="font-semibold text-purple-800">$7.00</span></p>
          <div className="mt-2 text-xs">
            <div className="flex justify-between">
              <span>Product Price:</span>
              <span>$12.00</span>
            </div>
            <div className="flex justify-between text-purple-800 font-medium">
              <span>Your Commission:</span>
              <span>${calculateCommission(12, "mug").commission.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-purple-600 text-center text-xs">
              (70% of amount above $7)
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Commission Examples</h3>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-4 text-xs font-medium border-b pb-1 text-gray-500">
            <div>Product</div>
            <div>Price</div>
            <div>Base Cost</div>
            <div>Your Commission</div>
          </div>
          
          <div className="grid grid-cols-4 text-xs">
            <div>T-Shirt</div>
            <div>$24.99</div>
            <div>$14.00</div>
            <div className="font-medium text-green-600">
              ${calculateCommission(24.99, "t-shirt").commission.toFixed(2)}
            </div>
          </div>
          
          <div className="grid grid-cols-4 text-xs">
            <div>T-Shirt (Low)</div>
            <div>$14.00</div>
            <div>$14.00</div>
            <div className="font-medium text-gray-600">$0.00</div>
          </div>
          
          <div className="grid grid-cols-4 text-xs">
            <div>Hat</div>
            <div>$18.50</div>
            <div>$8.00</div>
            <div className="font-medium text-green-600">
              ${calculateCommission(18.50, "hat").commission.toFixed(2)}
            </div>
          </div>
          
          <div className="grid grid-cols-4 text-xs">
            <div>Mug</div>
            <div>$15.99</div>
            <div>$7.00</div>
            <div className="font-medium text-green-600">
              ${calculateCommission(15.99, "mug").commission.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-2 border border-blue-200 rounded-lg bg-blue-50 text-xs text-blue-600">
        <p>💡 <strong>Pro Tip:</strong> Setting prices above the base cost thresholds will maximize your earnings. 
        For T-shirts, we recommend prices between $19.99-$29.99 for optimal sales and commissions.</p>
      </div>
    </div>
  );
};

export default CommissionGuide;