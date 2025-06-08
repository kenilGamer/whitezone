import { FaExclamationTriangle } from 'react-icons/fa';

interface StockManagementSettingsProps {
  lowStockThreshold: number;
  autoReorderEnabled: boolean;
  onThresholdChange: (value: number) => void;
  onAutoReorderChange: (enabled: boolean) => void;
}

export default function StockManagementSettings({
  lowStockThreshold,
  autoReorderEnabled,
  onThresholdChange,
  onAutoReorderChange
}: StockManagementSettingsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Management Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Low Stock Threshold
          </label>
          <input
            type="number"
            value={lowStockThreshold}
            onChange={(e) => onThresholdChange(parseInt(e.target.value))}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB9EC6] transition"
          />
          <p className="mt-1 text-sm text-gray-500">
            Products with stock below this number will be marked as low stock
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoReorder"
            checked={autoReorderEnabled}
            onChange={(e) => onAutoReorderChange(e.target.checked)}
            className="h-4 w-4 text-[#FB9EC6] focus:ring-[#FB9EC6] border-gray-300 rounded"
          />
          <label htmlFor="autoReorder" className="text-sm font-medium text-gray-700">
            Enable Auto Reorder
          </label>
        </div>

        {autoReorderEnabled && (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <FaExclamationTriangle />
            <p className="text-sm">
              Auto reorder is enabled. The system will suggest reorder quantities when stock is low.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 