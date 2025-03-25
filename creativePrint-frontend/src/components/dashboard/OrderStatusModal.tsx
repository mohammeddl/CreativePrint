import { AlertTriangle, CheckCircle } from "lucide-react";

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  newStatus: string;
  setNewStatus: (status: string) => void;
  statusNote: string;
  setStatusNote: (note: string) => void;
  onUpdateStatus: () => void;
  isUpdating: boolean;
  availableStatuses: Array<{ value: string; label: string }>;
}

const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  newStatus,
  setNewStatus,
  statusNote,
  setStatusNote,
  onUpdateStatus,
  isUpdating,
  availableStatuses
}) => {
  if (!isOpen) return null;

  return (
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
              {availableStatuses.map(status => (
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
          
          {newStatus === 'COMPLETED' && (
            <div className="mb-4 bg-green-50 p-4 rounded-md text-sm text-green-700 flex">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">Order Complete:</p>
                <p className="mt-1">Marking this order as completed will finalize the order process. This indicates the customer has received their items successfully.</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            onClick={onUpdateStatus}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
            disabled={isUpdating || !newStatus}
          >
            {isUpdating ? (
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
  );
};

export default OrderStatusModal;