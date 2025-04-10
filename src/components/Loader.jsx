import React from 'react'

function Loader() {
  return (
    <div className="flex justify-center items-center h-screen bg-[#FFE893]">
        <div className="w-16 h-16 border-t-4 border-b-4 border-gray-900 rounded-full animate-spin"></div>
    </div>
  )
}

export default Loader