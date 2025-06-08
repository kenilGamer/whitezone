import React from 'react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#FFE893] shadow-lg p-6">
      <nav>
        <h2 className="text-xl font-bold text-[#FB9EC6] mb-4">Navigation</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="/admin"
              className="block text-[#FB9EC6] hover:text-white hover:bg-[#FBB4A5] p-2 rounded-md font-medium transition"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/admin/products"
              className="block text-[#FB9EC6] hover:text-white hover:bg-[#FBB4A5] p-2 rounded-md font-medium transition"
            >
              Products
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
} 