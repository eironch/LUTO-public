import React from "react";
import { Link } from 'react-router-dom'
import ProfilePicture from "../assets/profile-picture.png"

function SidebarProfile(p) {
    const authorName = p.authorName

    return (
        <div className="grid pl-3 gap-3 w-full h-full overflow-hidden" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="flex flex-col gap-3 text-zinc-100 col-span-4 pointer-events-auto">
                {/* user  */}
                <div className="flex flex-row p-6 gap-6 items-center text-2xl rounded-3xl bg-zinc-900 overflow-hidden">
                    <img className="w-28" src={ ProfilePicture } alt="" />
                    <div className="grid grid-row-2 w-full gap-3">
                        <p className="px-1  font-semibold overflow-hidden">
                            { authorName }
                        </p>
                        
                        <button className="py-1 rounded-3xl text-lg text-center font-semibold gap-4 bg-orange-500 hover:bg-orange-400 overflow-hidden">
                            Follow
                        </button>
                    </div>
                </div>
                {/* bio */}
                <div className="flex flex-col gap-3 p-6 rounded-3xl bg-zinc-900">
                    <p className="text-2xl font-semibold">Bio</p>
                    <p>
                        An aspiring cook from the Pearl of the Orient Sea, the
                        Philippines. Here to learn and be part of the cooking community.
                    </p>
                </div>
                {/* friends */}
                <div className="flex flex-col gap-3 p-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl px-3 pt-3 font-semibold">Friends</p>
                    <div className="flex flex-col gap-3">
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 1</p>
                        </Link>
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 2</p>
                        </Link>
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 3</p>
                        </Link>
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 4</p>
                        </Link>
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 4</p>
                        </Link>
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 4</p>
                        </Link>
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 4</p>
                        </Link>
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 4</p>
                        </Link>
                        <Link className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                            <img className="w-16" src={ ProfilePicture } alt="" />
                            <p>Friend 4</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SidebarProfile
