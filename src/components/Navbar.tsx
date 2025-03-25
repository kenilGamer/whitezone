import React from 'react'
import { HiShoppingCart } from "react-icons/hi2";
import { MdOutlineMenu } from "react-icons/md";
function Navbar() {
  return (
    <div className='w-full py-4 p-8 text-white font-mono'>
        <nav className="flex items-center justify-between">
            <div className="container-fluid">
                <h1 className='text-2xl font-bold'>WhiteZone</h1>
            </div>
            <div>
                <ul className="flex space-x-4">
                    <li>Men</li>
                    <li>Women</li>
                    <li>Bags</li>
                    <li>Accessories</li>
                    <li>community</li>
                </ul>
            </div>
            <div className="flex space-x-4">
            <div className="flex items-center">
                    <HiShoppingCart className="text-3xl" />
                </div>
                <MdOutlineMenu className='text-3xl' />
            </div>
        </nav>
    </div>
  )
}

export default Navbar