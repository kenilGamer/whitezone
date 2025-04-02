"use client";
import React, { useState } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

function Sidebar({ onSearch }: { onSearch: (query: string) => void }) {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const categories = ["All Products", "T-Shirts", "Hoodies", "Shirts", "Caps"];

  

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Pass the search query to the parent component
  };

  return (
    <div className="relative">
      {/* Toggle Button for Sidebar */}
      <button
        className="absolute left-2 z-50 md:hidden text-3xl text-[#FB9EC6]"
        onClick={toggleSidebar}
      >
        {isOpen ? <IoMdClose className="text-3xl text-white" /> : <MdOutlineMenu />}
      </button>

      {/* Sidebar Content */}
      <div
        className={`fixed max-md:top-15 left-0 max-md:w-full h-full bg-[#f76faa] text-white p-6 shadow-lg flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 sm:w-48 lg:w-64`}
      >
        {/* Sidebar Header */}
        <h2 className="text-2xl font-bold mb-6">Categories</h2>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 rounded-lg border text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#da004c]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.65 10.35a6.3 6.3 0 11-12.6 0 6.3 6.3 0 0112.6 0z"
            />
          </svg>
        </div>

        {/* Category List */}
        <ul className="space-y-3">
          {categories.map((category, index) => (
            <a href={`/shop?category=${category}`} key={index}>
              <li className="cursor-pointer hover:bg-[#da004c] p-3 rounded-lg transition flex items-center gap-2">
                <span className="bg-white text-[#FB9EC6] w-6 h-6 flex items-center justify-center rounded-full font-bold">
                  {category[0]}
                </span>
                <span>{category}</span>
              </li>
            </a>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-white/50">
          <p className="text-sm text-white/80">© 2025 E-Shop. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;