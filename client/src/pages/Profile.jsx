import React from 'react'
import Post from '../components/Post'
import ProfileSidebar from '../components/ProfileSidebar'
import ProfileNavBar from '../components/ProfileNavBar'

function Profile(p) {
    return (
        <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-950">
            {/* space for top navbar */}
            <ProfileNavBar />
            <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                <div className="col-span-2"></div>
                <div className="col-span-11 h-16 rounded-3xl bg-zinc-900"></div>
                <div className="col-span-2"></div>     
            </div>
            {/* space for top navbar */}
            {/* content */}
            <ProfileSidebar />
            <ProfileSidebar />
            <ProfileSidebar /> 
            <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                <div className="col-span-4"></div>
                <div className="col-span-11 block"></div>
            </div>
            {/* content */}
        </div>
    )
}

export default Profile