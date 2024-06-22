import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <div className='sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg '>
      <div className='flex h-14 px-2.5 md:px-20 items-center justify-between'>
        <span className='text-xl'>
          Register Form
        </span>
        <Link to="/user">User management</Link>
      </div>
    </div>
  )
}

export default Navbar