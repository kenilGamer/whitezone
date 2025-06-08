"use client";
import React, { useState, useEffect } from "react";
import { HiShoppingCart } from "react-icons/hi2";
import { MdOutlineMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onWishlistClick, onProfileClick }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const cartItems = useSelector((state: any) => state.cart.items);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0));
  }, [cartItems]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-lg" : "bg-[#FCFFC1]"
      }`}
    >
      <nav className="py-4 px-8 text-[#3d3d3d] font-mono">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] bg-clip-text text-transparent">
                WhiteZone
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-base">
            {[
              { name: "Home", path: "/" },
              { name: "Men", path: "/men" },
              { name: "Women", path: "/women" },
              { name: "Bags", path: "/bags" },
              { name: "Shop", path: "/shop" }
            ].map((item) => (
              <motion.li
                key={item.name}
                whileHover={{ scale: 1.1 }}
                className="relative group"
              >
                <Link 
                  href={item.path}
                  className={`hover:text-[#FB9EC6] transition-colors duration-300 ${
                    isActive(item.path) ? "text-[#FB9EC6]" : ""
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#FB9EC6] transition-all duration-300 ${
                    isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}></span>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Cart and Profile Icons */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative group"
            >
              <Link href="/cart" className="relative">
                <HiShoppingCart className="text-3xl hover:text-[#ff81b8] transition-colors duration-300" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-[#FB9EC6] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                <div className="p-4">
                  <p className="text-sm text-gray-600">Items in cart: {cartCount}</p>
                  <Link
                    href="/cart"
                    className="block mt-2 text-center px-4 py-2 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:opacity-90 transition-opacity duration-300"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative group"
            >
              <Link href="/profile">
                <FaCircleUser className="text-3xl hover:text-[#ff69a3] transition-colors duration-300" />
              </Link>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                <div className="p-4">
                  <Link
                    href="/profile"
                    className="block text-center px-4 py-2 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:opacity-90 transition-opacity duration-300"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              className="md:hidden text-3xl"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <IoMdClose /> : <MdOutlineMenu />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 bg-white/95 backdrop-blur-md z-[1000] p-6 md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="text-3xl hover:text-[#FB9EC6] transition-colors duration-300"
                  onClick={toggleMenu}
                  aria-label="Close menu"
                >
                  <IoMdClose />
                </motion.button>
              </div>

              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col space-y-6 text-lg text-center mt-8"
              >
                {[
                  { name: "Home", path: "/" },
                  { name: "Shop", path: "/shop" },
                  { name: "Community", path: "/community" }
                ].map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      className={`hover:text-[#FB9EC6] transition-colors duration-300 ${
                        isActive(item.path) ? "text-[#FB9EC6]" : ""
                      }`}
                      onClick={toggleMenu}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-auto mb-8"
              >
                <Link
                  href="/contact"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-[#FB9EC6] to-[#ff2885] text-white rounded-lg hover:opacity-90 transition-opacity duration-300 text-center"
                  onClick={toggleMenu}
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;