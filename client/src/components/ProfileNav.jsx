import React from 'react'
import Backbutton from '../assets/back-button.png'
import Logo from '../assets/luto-logo-gradient.png'
import HomeIcon from '../assets/home-icon.png'
import PopularIcon from '../assets/popular-icon.png'
import SavedIcon from '../assets/saved-icon.png'
import SettingsIcon from '../assets/settings-icon.png'
import ProfilePicture from '../assets/profile-picture.png'
import './NavProfile.css';

function NavBar(p) {
    return (
        <div className="fixed flex flex-col gap-3 p-3 w-full h-svh pointer-events-none">
            <div className="flex flex-row w-full gap-3 h-16 pointer-events-auto">
                <div className="flex items-center justify-center w-2/12 rounded-3xl bg-zinc-900">
                    <button><img className="button" src={ Backbutton } alt=""></img></button>
                </div>
                <div className="flex items-center justify-center w-full rounded-3xl">
                    <div className="flex items-center justify-center rounded-3xl m-3 w-8/12 h-10 bg-zinc-700">
                        <img className="mid-logo" src={ Logo } alt=""></img>
                    </div>
                </div>
                <div className="flex items-center justify-end w-2/12 col-span-3 rounded-3xl bg-zinc-900">
                    <p className="text-zinc-50 text-end w-full ml-3 text-xl overflow-hidden">{ p.username }</p>
                    <img className="m-3 w-10" src={ ProfilePicture } alt=""></img>
                </div>     
            </div>
            <div className="flex flex-row w-full gap-3 h-full">
                <div className="w-2/12 rounded-3xl bg-zinc-900 pointer-events-auto">
                    <div className="flex items-center flex-col gap-3 m-3">
                        <button className="flex flex-row w-full rounded-3xl hover:bg-zinc-700">
                            <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                <img className="w-8" src={ HomeIcon } alt=""></img>
                                <p className="text-zinc-50 text-lg">Home</p>
                            </div>
                        </button>
                        <button className="flex flex-row w-full rounded-3xl hover:bg-zinc-700">
                            <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                <img className="w-8" src={ PopularIcon } alt=""></img>
                                <p className="text-zinc-50 text-lg">Popular</p>
                            </div>
                        </button>
                        <button className="flex flex-row w-full rounded-3xl hover:bg-zinc-700">
                            <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                <img className="w-8" src={ SavedIcon } alt=""></img>
                                <p className="text-zinc-50 text-lg">Saved</p>
                            </div>
                        </button>
                        <button className="flex flex-row w-full rounded-3xl hover:bg-zinc-700">
                            <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                                <img className="w-8" src={ SettingsIcon } alt=""></img>
                                <p className="text-zinc-50 text-lg">Settings</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col w-full gap-3 bg-transparent"></div>
                <div className="flex items-center justify-center w-2/12 rounded-3xl bg-zinc-900"></div>        
            </div>
        </div>
    )
}

export default NavBar