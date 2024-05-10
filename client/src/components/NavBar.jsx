import React from 'react'
import SearchBar from '../components/SearchBar'
import Logo from '../assets/luto-logo-gradient.png'
import HomeIcon from '../assets/home-icon.png'
import PopularIcon from '../assets/popular-icon.png'
import SavedIcon from '../assets/saved-icon.png'
import SettingsIcon from '../assets/settings-icon.png'
import ProfilePicture from '../assets/profile-picture.png'

function NavBar(p) {
    return (
        <div className={`${ p.currentTab==="Home" && "pr-0" } fixed flex flex-col gap-3 p-3 w-full h-svh pointer-events-none`}>
            { p.currentTab==="Home" && <SearchBar /> }
            <div className="grid gap-3 w-full h-16 pointer-events-none" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                {
                    p.currentTab==="Home" &&
                    <div className="rounded-3xl flex col-span-2 items-center justify-center bg-zinc-900">
                        <img className="m-3 px-4 w-48" src={ Logo } alt="" />   
                    </div>
                }
                <div className={`${ p.currentTab!=="Home" && "bg-zinc-900" } rounded-3xl flex items-center justify-center`} style={ { gridColumn: p.currentTab==="Home" ? "span 11" : "span 13" } }>
                    { p.currentTab!=="Home" && <img className="p-3 w-48 fixed left-1/2 transform -translate-x-1/2" src={ Logo } alt="" /> }
                </div>
                <div className="col-span-2 flex items-center justify-end rounded-3xl bg-zinc-900">
                    <p className="text-zinc-200 text-end w-full ml-3 text-xl overflow-hidden">{ p.username }</p>
                    <img className="m-3 w-10" src={ ProfilePicture } alt="" />
                </div>     
            </div>
            <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                <div className="col-span-2 rounded-3xl bg-zinc-900 pointer-events-auto">
                    <div className="flex items-center flex-col gap-3 m-3">
                        <button className={`${ p.currentTab==="Home" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => {p.setCurrentTab("Home")}}>
                            <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                <img className="w-8" src={ HomeIcon } alt="" />
                                <p className="text-zinc-200 text-lg">Home</p>
                            </div>
                        </button>
                        <button className={`${ p.currentTab==="Popular" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => {p.setCurrentTab("Popular")}}>
                            <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                <img className="w-8" src={ PopularIcon } alt="" />
                                <p className="text-zinc-200 text-lg">Popular</p>
                            </div>
                        </button>
                        <button className={`${ p.currentTab==="Saved" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => {p.setCurrentTab("Saved")}}>
                            <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                <img className="w-8" src={ SavedIcon } alt="" />
                                <p className="text-zinc-200 text-lg">Saved</p>
                            </div>
                        </button>
                        <button className={`${ p.currentTab==="Settings" && "bg-zinc-700 shadow-sm shadow-zinc-950" } flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => {p.setCurrentTab("Settings")}}>
                            <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                <img className="w-8" src={ SettingsIcon } alt="" />
                                <p className="text-zinc-200 text-lg">Settings</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="col-span-11 flex flex-col gap-3 bg-transparent"></div>
                <div className={`${ p.currentTab==="Home" && "bg-zinc-900" } col-span-2 flex items-center justify-center rounded-3xl`}></div>        
            </div>
        </div>
    )
}

export default NavBar