import React from 'react';

export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className='m-4 px-4 py-2 transition-all outline-0 rounded bg-purple-900 text-white shadow hover:relative hover:bottom-1'>
      {children}
    </button>
  )
}