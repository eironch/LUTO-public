import React from 'react'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback'
import ProfilePicture from '../assets/profile-picture.png'
import Image from '../assets/placeholder-img.png'
import ApproveIcon from '../assets/approve-icon.png'
import DiscussionIcon from '../assets/discussion-icon.png'

function SidebarBuilder(p) {
    return (
        <div className="pl-3 grid w-full h-full overflow-hidden" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="flex overflow-x-hidden overflow-y-auto h-full scrollable-div flex-col text-zinc-100 col-span-4 pointer-events-auto">
                <div className="p-3 mb-3 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400">
                    <img className="w-full h-auto rounded-3xl object-cover" src={ Image } alt="" />
                    <div className="grid grid-cols-2 p-3 pb-0">
                        <div className="flex gap-3 items-center justify-start">
                            <img className="w-10" src={ DiscussionIcon } alt="" />
                            <p className="text-lg">1.1k</p>
                        </div>
                        <div className="flex gap-3 items-center justify-end">
                            <p className="text-lg">1.1k</p>
                            <img className="w-10" src={ ApproveIcon } alt="" />
                        </div>
                    </div>
                </div>
                <Link to={`/${ p.username }`} className="flex gap-6 flex-row items-center mb-3 p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-500">
                    <img className="w-14" src={ ProfilePicture } alt="" />
                    <p className="text-xl">{ p.username }</p>
                </Link>
                <div className="flex flex-col gap-6 p-6 mb-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl font-semibold">Summary</p>
                    <p className="text-lg">Enjoy a satisfying homemade Vegetable Bowl in just 3 minutes! This quick recipe combines fluffy rice with savory diced meat, a perfectly cooked egg, sweet corn kernels, nutritious spinach, and tangy diced tomatoes. It's a delicious and wholesome meal ready in no time!</p>
                </div>
                <div className="flex flex-col gap-6 p-6 mb-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl font-semibold">Ingredients</p>
                    <ul className="text-lg">
                        <li>
                            ½ cup water
                        </li>
                        <li>
                            ⅓ cup light soy sauce
                        </li>
                        <li>
                            ¼ cup vegetable oil
                        </li>
                        <li>
                            3 tablespoons lemon pepper seasoning    
                        </li>
                        <li>
                            2 teaspoons minced garlic
                        </li>
                        <li>
                            6 boneless pork loin chops, trimmed of fat   
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col gap-6 p-6 mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row items-center gap-6">
                        <img className="w-10" src={ DiscussionIcon } alt="" />
                        <p className="text-2xl font-semibold">Feedbacks</p>
                        <p className="flex text-xl font-semibold justify-end w-full">1.1k</p>
                    </div>
                    <Feedback username={ p.username }/>
                    <Feedback username={ p.username }/>
                    <Feedback username={ p.username }/>
                    <Feedback username={ p.username }/>
                    <Feedback username={ p.username }/>
                    <Feedback username={ p.username }/>
                </div>
            </div>
        </div>
    )
}

export default SidebarBuilder