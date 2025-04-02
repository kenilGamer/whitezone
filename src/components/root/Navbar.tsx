"use client";
import React, { useState } from "react";
import { HiShoppingCart } from "react-icons/hi2";
import { MdOutlineMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to toggle mobile menu

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="py-4 px-8 text-[#3d3d3d] font-mono bg-[#FCFFC1] shadow-md">
      <nav className="flex items-center justify-between">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold">WhiteZone</h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-base">
          <li><a href="/" className="hover:text-[#FB9EC6] transition">Home</a></li>
          <li><a href="#" className="hover:text-[#FB9EC6] transition">Men</a></li>
          <li><a href="#" className="hover:text-[#FB9EC6] transition">Women</a></li>
          <li><a href="#" className="hover:text-[#FB9EC6] transition">Bags</a></li>
          <li><a href="/shop" className="hover:text-[#FB9EC6] transition">Shop</a></li>
        </ul>

        {/* Cart Icon and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <a href="/cart" className="flex items-center">
            <HiShoppingCart className="text-3xl hover:text-[#FB9EC6] transition" />
          </a>
          <button className="md:hidden text-3xl" onClick={toggleMenu}>
            {isOpen ? <IoMdClose /> : <MdOutlineMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-[#FCFFC1] text-[#3d3d3d] z-[1000] p-6 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-3xl hover:text-[#FB9EC6] transition"
          onClick={toggleMenu}
        >
          <IoMdClose />
        </button>

        {/* Menu Content */}
        <div className="flex flex-col justify-center items-center h-full space-y-8">
          <ul className="flex flex-col space-y-6 text-lg text-center">
            <li>
              <a
                href="/"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Men
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Women
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Bags
              </a>
            </li>
            <li>
              <a
                href="/shop"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Shop
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                About Us
              </a>
            </li>
            <li>
              <a
                href="/accessories"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Accessories
              </a>
            </li>
            <li>
              <a
                href="/community"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Community
              </a>
            </li>
          </ul>

          {/* Call-to-Action Button */}
          <a
            href="/contact"
            className="px-6 py-3 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition"
            onClick={toggleMenu}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;