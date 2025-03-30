import Navbar from '@/components/root/Navbar'
import Sidebar from '@/components/shop/Sidebar'
import React from 'react'
function page() {
  return (
    <div className='h-screen w-full bg-[#FFE893]'>
        <Navbar/>
        <Sidebar/>
    </div>
  )
}

export default page