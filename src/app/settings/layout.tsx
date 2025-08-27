import React from 'react'
import Navbar from '../../components/ui/navbar/Navbar'
import ProfileSidebar from '../../components/profile/ProfileSidebar'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { redirect } from 'next/navigation'

async function Layout({ children }: { children: React.ReactNode }) {

    const session = await getServerSession(authOptions);

    if (!session) redirect('/auth/login');

    return (
        <React.Fragment>
            <div className="h-screen flex-grow px-4 pt-20 flex flex-col bg-gray-50 dark:bg-gray-900 text-[#2D3436] dark:text-gray-100">
                <Navbar type="profile" session={session} />

                <div className="p-8 flex flex-1 overflow-auto gap-5">
                    <ProfileSidebar />

                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-full h-full p-4 overflow-auto scrollbar-none">
                        {children}
                    </section>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Layout