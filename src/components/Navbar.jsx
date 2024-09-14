import React from 'react'

const Navbar = () => {
  return (
    <nav className='text-white flex justify-between items-center py-5 px-7'>
      <div className="logo font-bold cursor-pointer text-lg">
        <span className='text-red-700'>&lt;</span>
        Pass
        <span className='text-red-700'>OP/&gt;</span>
      </div>
      <div className="">
        <ul className='flex gap-6'>
          <li className='hover:font-bold hover:text-red-700 cursor-pointer'>Home</li>
          <li className='hover:font-bold hover:text-red-700 cursor-pointer'>About</li>
          <li className='hover:font-bold hover:text-red-700 cursor-pointer'>Contact</li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
