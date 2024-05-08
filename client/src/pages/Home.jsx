import React, { useState } from 'react'
import Post from '../components/Post'
import NavBar from '../components/NavBar'

function Home(p) {
    return (
        <div>
            <NavBar />
            <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-950">
                <div className="flex flex-row w-full gap-3 h-16">
                    <div className="w-2/12"></div>
                    <div className="h-16 w-full rounded-3xl bg-zinc-900"></div>
                    <div className="w-2/12"></div>     
                </div>
                <div className="flex flex-row w-full gap-3 h-full">
                    <div className="w-2/12"></div>
                    <div className="flex flex-col w-full gap-3">
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                        <Post />
                    </div>
                    <div className="w-2/12"></div>        
                </div>
            </div>
        </div>
    )
}

export default Home