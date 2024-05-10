import React from 'react'
import HomeIcon from '../assets/home-icon.png'
import PopularIcon from '../assets/popular-icon.png'
import SavedIcon from '../assets/saved-icon.png'
import SettingsIcon from '../assets/settings-icon.png'

function TabSidebar(p) {
    return (
        <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="col-span-2 rounded-3xl bg-zinc-900 pointer-events-auto">
                <div className="flex items-center flex-col gap-3 m-3">
                    <button className={`${ p.currentTab==="Home" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => { p.setCurrentTab("Home") }}>
                        <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                            <img className="w-8" src={ HomeIcon } alt="" />
                            <p className="text-zinc-200 text-lg">Home</p>
                        </div>
                    </button>
                    <button className={`${ p.currentTab==="Popular" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => { p.setCurrentTab("Popular") }}>
                        <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                            <img className="w-8" src={ PopularIcon } alt="" />
                            <p className="text-zinc-200 text-lg">Popular</p>
                        </div>
                    </button>
                    <button className={`${ p.currentTab==="Saved" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => { p.setCurrentTab("Saved") }}>
                        <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                            <img className="w-8" src={ SavedIcon } alt="" />
                            <p className="text-zinc-200 text-lg">Saved</p>
                        </div>
                    </button>
                    <button className={`${ p.currentTab==="Settings" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => { p.setCurrentTab("Settings") }}>
                        <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                            <img className="w-8" src={ SettingsIcon } alt="" />
                            <p className="text-zinc-200 text-lg">Settings</p>
                        </div>
                    </button>
                </div>
            </div>
            <div className="col-span-11"></div>
            <div className={`${ p.currentTab==="Home" && "bg-zinc-900 flex items-center justify-center rounded-3xl" } col-span-2`}></div>        
        </div>
    )
}

export default TabSidebar