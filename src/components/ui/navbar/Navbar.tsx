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
    <nav className="p-4 px-5 h-20">
      <div className="flex justify-between items-center h-full">
        <RelinkLogo height={40} width={40} onClick={goHome} />
        {
          session && <Navigation session={session} />
        }
      </div>
    </nav>
  )
}



export default Navbar
