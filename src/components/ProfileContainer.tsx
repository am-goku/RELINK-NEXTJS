import React from 'react'
import Navbar from './ui/Navbar'
import ProfileSidebar from './ProfileSidebar'


function ProfileContainer({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen">
                <Navbar type="profile" />
                <div className="flex flex-col md:flex-row px-4 md:px-10 gap-8">

                    <aside className="w-full md:w-1/4">
                        <ProfileSidebar />
                    </aside>

                    {children}

                </div>
            </div>
        </>
    )
}

export default ProfileContainer