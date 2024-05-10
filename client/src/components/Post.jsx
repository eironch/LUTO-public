import React, { useState } from 'react'
import Image from '../assets/placeholder-img.png'
import DiscussionIcon from '../assets/discussion-icon.png'
import ApprovalIcon from '../assets/approval-icon.png'

function Post(p) {
    return (
        <div className="flex flex-row w-full rounded-3xl">
            <div className="grid grid-cols-12 w-full rounded-3xl bg-zinc-900 overflow-hidden">
                <div className="col-span-4 rounded-3xl p-3 shadow-zinc-950 shadow-right bg-gradient-to-b from-orange-500 to-orange-400">
                    <img className="w-full rounded-3xl" src={ Image } alt=""></img>
                </div>
                <div className="col-span-8 flex flex-col">
                    <div className="flex flex-col w-full h-full gap-3">
                        <p className="mx-6 mt-6 text-zinc-50 text-3xl font-bold line-clamp-2">3 minute Homemade Vegetable Bowl! With Rice, Meat, Egg, Corn, Spinach, and Tomato With Rice, Meat, Egg, Corn, Spinach, and Tomato With Rice, Meat, Egg, Corn, Spinach, and Tomato With Rice, Meat, Egg, Corn, Spinach, and Tomato</p>
                        <p className="mx-6 text-zinc-400 text-lg">xXx_User_xXx’s Recipe • February 8</p>
                        <p className="mx-6 text-zinc-50 text-lg text-ellipsis overflow-hidden line-clamp-5">Enjoy a satisfying homemade Vegetable Bowl in just 3 minutes! This quick recipe combines fluffy rice with savory diced meat, a perfectly cooked egg, sweet corn kernels, nutritious spinach, and tangy diced tomatoes. It's a delicious and wholesome meal ready in no time! Enjoy a satisfying homemade Vegetable Bowl in just 3 minutes! This quick recipe combines fluffy rice with savory diced meat, a perfectly cooked egg,  ready in no time! Enjoy a satisfying homemade Vegetable Bowl in just 3 minutes! This quick recipe combines fluffy rice with savory diced meat, a perfectly cooked egg, sweet corn kernels, nutritious spinach,</p>
                    </div>
                    <div className="grid grid-cols-2 mb-6 ml-6">
                       <div className="flex flex-row items-center gap-4 text-zinc-50 text-lg">
                            <button>
                                <img className="w-12" src={ DiscussionIcon } alt=""></img>
                            </button>
                            <p>1.1k</p>
                       </div>
                       <div className="flex justify-end items-center mr-6 gap-4 text-zinc-50 text-lg">
                            <p>1.1k</p>
                            <button>   
                                <img className="w-12" src={ ApprovalIcon } alt=""></img>
                            </button>
                       </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post