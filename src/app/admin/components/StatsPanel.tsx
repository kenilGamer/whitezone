import React from "react";
import { motion } from "framer-motion";
import { Stats } from "../types";

interface StatsPanelProps {
  stats: Stats;
  show: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, show }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto"
    >
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Total Products</h3>
            <p className="text-2xl font-bold text-blue-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Total Stock</h3>
            <p className="text-2xl font-bold text-green-900">{stats.totalStock}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">Total Value</h3>
            <p className="text-2xl font-bold text-purple-900">${stats.totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-800">Low Stock Items</h3>
            <p className="text-2xl font-bold text-red-900">{stats.lowStock}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
        <div className="space-y-4">
          {Object.entries(stats.categoryDistribution).map(([category, count]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{category}</span>
                <span className="text-gray-600">{count} items</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${(count / stats.totalProducts) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity.map((activity, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                activity.type === "add"
                  ? "bg-green-50"
                  : activity.type === "update"
                  ? "bg-blue-50"
                  : "bg-red-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{activity.product}</span>
                <span
                  className={`text-sm ${
                    activity.type === "add"
                      ? "text-green-800"
                      : activity.type === "update"
                      ? "text-blue-800"
                      : "text-red-800"
                  }`}
                >
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{activity.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsPanel; 