import React, { useState, useLayoutEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback'
import Textarea from '../components/Textarea'
import ProfilePicture from '../assets/profile-picture.png'
import Image from '../assets/placeholder-img.png'
import ApproveIcon from '../assets/approve-icon.png'
import DiscussionIcon from '../assets/discussion-icon.png'
import AddIngredient from '../assets/add-icon.png'

function SidebarRecipe(p) {
    const user = p.user
    const summary = p.summary
    const setSummary = p.setSummary
    const ingredients = p.ingredients
    const setIngredients = p.setIngredients

    return (
        <div className="pl-3 grid w-full h-full overflow-hidden" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="flex overflow-x-hidden overflow-y-scroll h-full scrollable-div flex-col text-zinc-100 col-span-4 pointer-events-auto">
                {/* Recipe Image */}
                <div className="p-2 mb-3 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-400">
                    <div className="relative w-full h-auto aspect-w-2 aspect-h-2 bg-white rounded-3xl">
                        <img className="absolute inset-0 w-full h-full rounded-3xl object-cover" src={ Image } alt="" />
                    </div>
                    <div className="grid grid-cols-2 pt-2">
                        <div className="flex">
                            <div className="flex gap-3 px-4 py-2 items-center justify-start rounded-3xl hover:bg-orange-400">
                                <button className="hover:underline">
                                    <img className="w-10" src={ DiscussionIcon } alt="" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex gap-3 px-4 py-2 items-center rounded-3xl hover:bg-orange-400">
                                <button>
                                    <img className="w-10" src={ ApproveIcon } alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* User */}
                <Link to={`/${ user.username }`} className="flex gap-6 flex-row items-center mb-3 p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-500">
                    <img className="w-14" src={ ProfilePicture } alt="" />
                    <p className="text-xl font-semibold">{ user.username }</p>
                </Link>
                {/* Summary */}
                <div className="flex flex-col p-6 gap-6 mb-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl font-semibold">Summary</p>
                    <p className="text-justify text-lg">{ summary }</p>
                            
                </div>
                {/* Ingredients */}
                <div className="flex flex-col gap-6 p-6 mb-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl font-semibold">Ingredients</p>
                    <ul className="text-lg flex flex-col gap-3">
                        {
                            ingredients &&
                            ingredients.map(ingredient => 
                                <li className="flex rounded-3xl text-center items-center">
                                    <p className="pr-3  text-2xl font-bold">•</p>
                                    <p className="text-lg">{ ingredient }</p>      
                                </li>
                            )
                        }
                    </ul>
                </div>
                {/* Feedbacks */}
                <div className="flex flex-col gap-6 p-6 mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row items-center gap-6">
                        <img className="w-10" src={ DiscussionIcon } alt="" />
                        <p className="text-2xl font-semibold">Feedbacks</p>
                        <p className="flex text-xl font-semibold justify-end w-full"></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SidebarRecipe