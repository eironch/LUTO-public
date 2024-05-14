import React, { useLayoutEffect } from 'react'
import NavBar from '../components/NavBar'

function Search(p) {
    useLayoutEffect(() => {
        p.setCurrentTab("Search")
    })

    return (
        <div>
            <NavBar username={ p.username } currentTab={ p.currentTab } setCurrentTab={ p.setCurrentTab } />
            <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-950">
                {/* space for top navbar */}
                <div className="grid w-full gap-3 mt-36 min-h-14" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-2"></div>
                    <div className="col-span-11"></div>
                    <div className="col-span-2"></div>     
                </div>
                {/* content */}
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-2"></div>
                    <div className="col-span-11 flex flex-col p-9 bg-zinc-900 rounded-3xl text-zinc-100">
                    <p className="text-4xl font-bold">Categories</p>
                    </div>
                    <div className="col-span-2"></div>
                </div>
            </div>
        </div>
    )
}

export default Search