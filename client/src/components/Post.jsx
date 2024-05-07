import React from 'react'
import Image from '../assets/placeholder-img.png'

function Post(p) {
    return (
        <div className="flex flex-row w-full rounded-3xl">
            <div className="flex flex-row w-full rounded-3xl bg-zinc-900 overflow-hidden">
                <div className="w-6/12 rounded-3xl p-3 shadow-zinc-950 shadow-right bg-gradient-to-b from-orange-500 to-orange-400">
                    <img className="w-full rounded-3xl" src={ Image } alt=""></img>
                </div>
                <div className="w-full">

                </div>
            </div>
        </div>
    )
}

export default Post