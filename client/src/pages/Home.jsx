import React, { useState } from 'react'
import Post from '../components/Post'
import Logo from '../assets/luto-logo-gradient.png'
import SearchIcon from '../assets/search-icon.png'
import HomeIcon from '../assets/home-icon.png'
import PopularIcon from '../assets/popular-icon.png'
import SavedIcon from '../assets/saved-icon.png'
import SettingsIcon from '../assets/settings-icon.png'
import ProfilePicture from '../assets/profile-picture.png'

function Home(p) {
    return (
        <div>
            <div className="fixed flex flex-col gap-3 p-3 w-full h-svh">
                <div className="flex flex-row w-full gap-3 h-16">
                    <div className="flex items-center justify-center w-2/12 rounded-3xl bg-zinc-900">
                        <img className="w-48 m-3 px-4" src={ Logo } alt=""></img>
                    </div>
                    <div className="flex items-center justify-center w-full rounded-3xl">
                        <div className="flex items-center justify-center rounded-3xl m-3 w-8/12 h-10 bg-zinc-700">
                            <img className="mx-4 w-6" src={ SearchIcon } alt=""></img>
                            <input className="w-full h-10 rounded-3xl bg-transparent text-zinc-400 text-center" src={ SearchIcon } type="text" placeholder="Search"/>
                            <div className="flex flex-row mx-4 w-6 text-zinc-400">•••</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end w-2/12 col-span-3 rounded-3xl bg-zinc-900">
                        <p className="text-zinc-50 text-end w-full ml-3 text-xl overflow-hidden">{ p.username }</p>
                        <img className="m-3 w-10" src={ ProfilePicture } alt=""></img>
                    </div>     
                </div>
                <div className="flex flex-row w-full gap-3 h-full">
                    <div className="w-2/12 rounded-3xl bg-zinc-900">
                        <div className="flex items-center flex-col gap-3 m-3">
                            <button className="flex flex-row w-full rounded-3xl hover:bg-zinc-700">
                                <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                    <img src={ HomeIcon } alt=""></img>
                                    <p className="text-zinc-50 text-lg">Home</p>
                                </div>
                            </button>
                            <button className="flex flex-row w-full rounded-3xl hover:bg-zinc-700">
                                <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                    <img src={ PopularIcon } alt=""></img>
                                    <p className="text-zinc-50 text-lg">Popular</p>
                                </div>
                            </button>
                            <button className="flex flex-row w-full rounded-3xl hover:bg-zinc-700">
                                <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                    <img src={ SavedIcon } alt=""></img>
                                    <p className="text-zinc-50 text-lg">Saved</p>
                                </div>
                            </button>
                            <button className="flex flex-row w-full rounded-3xl hover:bg-zinc-700">
                                <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                    <img src={ SettingsIcon } alt=""></img>
                                    <p className="text-zinc-50 text-lg">Settings</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-3"></div>
                    <div className="flex items-center justify-center w-2/12 rounded-3xl bg-zinc-900"></div>        
                </div>
            </div>
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