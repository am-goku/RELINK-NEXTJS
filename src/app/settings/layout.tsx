import React from 'react'
import Navbar from '../../components/ui/Navbar'
import ProfileSidebar from '../../components/ProfileSidebar'
import SessionContainer from '../../providers/SessionContainer'

function Layout({ children }: { children: React.ReactNode }) {

    return (
        <SessionContainer>
            <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-[#2D3436] dark:text-gray-100">
                <Navbar type="profile" />

                <div className="p-8 flex flex-1 overflow-auto gap-5">
                    <ProfileSidebar />

                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-full h-full p-4 overflow-auto scrollbar-none">
                        {children}
                    </section>
                </div>
            </div>
        </SessionContainer>
    )
}

export default Layout