"use client";
import React, { useState } from "react";
import { HiShoppingCart } from "react-icons/hi2";
import { MdOutlineMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import Link from "next/link";

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
          <li>
            <Link href="/" className="hover:text-[#FB9EC6] transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-[#FB9EC6] transition">
              Men
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-[#FB9EC6] transition">
              Women
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-[#FB9EC6] transition">
              Bags
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-[#FB9EC6] transition">
              Shop
            </Link>
          </li>
        </ul>

        {/* Cart Icon and Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          <a href="/cart" className="flex items-center">
            <HiShoppingCart className="text-3xl hover:text-[#ff81b8] transition" />
          </a>
          <a href="/profile" className="flex items-center">
            <FaCircleUser className="text-3xl hover:text-[#ff69a3] transition" />
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
              <Link
                href="/"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/shop"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className="hover:text-[#FB9EC6] transition"
                onClick={toggleMenu}
              >
                Community
              </Link>
            </li>
          </ul>

          {/* Call-to-Action Button */}
          <Link
            href="/contact"
            className="px-6 py-3 bg-[#FB9EC6] text-white rounded-lg hover:bg-[#da004c] transition"
            onClick={toggleMenu}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;