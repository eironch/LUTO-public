import React from 'react'
import { Link } from 'react-router-dom'
import HomeIcon from '../assets/home-icon.png'
import PopularIcon from '../assets/popular-icon.png'
import SavedIcon from '../assets/saved-icon.png'
import CreateIcon from '../assets/create-icon.png'
import SettingsIcon from '../assets/settings-icon.png'

function TabSidebar(p) {
    return (
        <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="col-span-2 rounded-3xl bg-zinc-900 pointer-events-auto">
                <div className="flex items-center flex-col gap-3 m-3">
                    <Link to="/" className={`${ p.currentTab==="Home" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`}>
                        <img className="w-8" src={ HomeIcon } alt="" />
                        <p className="text-zinc-100 text-lg">Home</p>
                    </Link>
                    <Link to="/popular" className={`${ p.currentTab==="Popular" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`}>
                        <img className="w-8" src={ PopularIcon } alt="" />
                        <p className="text-zinc-100 text-lg">Popular</p>
                    </Link>
                    <Link to="/saved" className={`${ p.currentTab==="Saved" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`}>
                        <img className="w-8" src={ SavedIcon } alt="" />
                        <p className="text-zinc-100 text-lg">Saved</p>
                    </Link>
                    <Link to="/create" className={`${ p.currentTab==="Create" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`}>
                        <img className="w-8" src={ CreateIcon } alt="" />
                        <p className="text-zinc-100 text-lg">Create</p>
                    </Link>
                    <Link to="/settings" className={`${ p.currentTab==="Settings" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`}>
                        <img className="w-8" src={ SettingsIcon } alt="" />
                        <p className="text-zinc-100 text-lg">Settings</p>
                    </Link>
                </div>
            </div>
            <div className="col-span-11"></div>
            <div className={`${ (p.currentTab==="Home" || p.currentTab==="Search") && "bg-zinc-900 flex items-center justify-center rounded-3xl" } col-span-2`}></div>        
        </div>
    )
}

export default TabSidebar