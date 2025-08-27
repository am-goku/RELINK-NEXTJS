'use client'

import React, { useEffect } from 'react'
import RelinkLogo from '../../icons/RelinkLogo'
import Navigation from './Navigation'
import { Session } from 'next-auth'

interface NavProps {
  type: 'home' | 'explore' | 'chat' | 'profile' | 'login'
  session?: Session | null
}

const Navbar: React.FC<NavProps> = ({ type, session }) => {

  useEffect(() => {
    document.getElementById(type)?.classList.add('bg-[#6C5CE7]');
  }, [type])

  function goHome() {
    window.location.href = '/';
  }

  return (
    // <nav className="p-4 px-5 h-20">
    //   <div className="flex justify-between items-center h-full">
    //     <RelinkLogo height={40} width={40} onClick={goHome} />
    //     {
    //       session && <Navigation session={session} />
    //     }
    //   </div>
    // </nav>

    <nav className="fixed top-0 left-0 right-0 z-50 h-20 px-5 bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="flex justify-between items-center h-full">
        <RelinkLogo height={40} width={40} onClick={goHome} />
        {session && <Navigation session={session} />}
      </div>
    </nav>
  )
}



export default Navbar
