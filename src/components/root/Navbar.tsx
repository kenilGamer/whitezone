"use client";
import React, { useState } from 'react';
import { HiShoppingCart } from "react-icons/hi2";
import { MdOutlineMenu } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Renamed state variable

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Updated setter function
    };

    return (
        <div className={` py-4 p-8 text-[#3d3d3d] font-mono ${isOpen ? 'w-2/3' : 'w-full'}`}>
            <nav className="flex items-center justify-between">
                <div className="container-fluid">
                    <h1 className='text-2xl font-bold'>WhiteZone</h1>
                </div>
                <div>
                    <ul className="flex space-x-4 text-xl max-md:hidden">
                        <li>Men</li>
                        <li>Women</li>
                        <li>Bags</li>

                    </ul>
                </div>
                <div className="flex space-x-4">
                    <div className="flex items-center">
                        <HiShoppingCart className="text-3xl" />
                    </div>
                    
                    {
                        isOpen === true ?(
                            <div className="absolute top-0 right-0 md:w-1/3 w-full z-50 h-full bg-[#FCFFC1] text-[#3d3d3d]     p-4 rounded shadow-lg">
                                 <IoMdClose  className='text-3xl absolute top-4 right-4' onClick={toggleMenu} />
                                <ul>
                                 <li><a href='/about'> About Us   </a></li>   
                                <li> <a href='/accessories'> Accessories</a></li>
                                <li> <a href='/community'> Community  </a></li>
                                </ul>
                            </div>
                        ):
                        (<MdOutlineMenu className='text-3xl' onClick={toggleMenu} />)
                    }
                </div>
            </nav>
        </div>
    );
}

export default Navbar;