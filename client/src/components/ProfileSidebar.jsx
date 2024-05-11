import React from 'react'

function ProfileSidebar(p) {
    return (
        <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="col-span-4 rounded-3xl bg-zinc-900 pointer-events-auto"></div>
            <div className="col-span-11"></div>
        </div>
    )
}

export default ProfileSidebar