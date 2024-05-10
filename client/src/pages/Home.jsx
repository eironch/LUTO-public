import React, { useState } from 'react'
import Post from '../components/Post'

function Home(p) {
    return (
        <div className="pr-0 flex flex-col gap-3 p-3 h-svh bg-zinc-950">
            {/* space for top navbar */}
            <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                <div className="col-span-2"></div>
                <div className="col-span-11 h-16 rounded-3xl bg-zinc-900"></div>
                <div className="col-span-2"></div>     
            </div>
            {/* space for top navbar */}
            {/* content */}
            <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                <div className="col-span-2"></div>
                <div className="col-span-11 block">
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                </div>
                <div className="col-span-2"></div>
            </div>
            {/* content */}
        </div>
    )
}

export default Home