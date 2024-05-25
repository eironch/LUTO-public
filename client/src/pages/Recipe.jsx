import React from 'react'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback'
import Textarea from '../components/Textarea'
import ProfilePicture from '../assets/profile-picture.png'
import Image from '../assets/placeholder-img.png'
import ApproveIcon from '../assets/approve-icon.png'
import DiscussionIcon from '../assets/discussion-icon.png'

function SidebarBuilder(p) {
    return (
        <div className="pl-3 grid w-full h-full overflow-hidden" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="flex overflow-x-hidden overflow-y-auto h-full scrollable-div flex-col text-zinc-100 col-span-4 pointer-events-auto">
                <div className="p-2 mb-3 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-400">
                    <img className="w-full h-auto rounded-3xl object-cover" src={ Image } alt="" />
                    <div className="grid grid-cols-2 pt-2">
                        <div className="flex">
                            <div className="flex gap-3 px-4 py-2 items-center justify-start rounded-3xl hover:bg-orange-400">
                                <button className="hover:underline">
                                    <img className="w-10" src={ DiscussionIcon } alt="" />
                                </button>
                                <button className="hover:underline">
                                    <p className="text-lg">1.1k</p>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex gap-3 px-4 py-2 items-center rounded-3xl hover:bg-orange-400">
                                <p className="text-lg">1.1k</p>
                                <button>
                                    <img className="w-10" src={ ApproveIcon } alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Link to={`/${ p.user.username }`} className="flex gap-6 flex-row items-center mb-3 p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-500">
                    <img className="w-14" src={ ProfilePicture } alt="" />
                    <p className="text-xl">{ p.user.username }</p>
                </Link>
                <div className="flex flex-col p-3 mb-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl font-semibold p-3 mb-6">Summary</p>
                    <Textarea placeholder="What would you describe your dish?" maxLength={ 300 } value={ p.summary } setValue={ p.setSummary }/>
                    <p className="p-3 mt-3 w-full flex justify-end">{`${ p.summary.length }/300`}</p>
                </div>
                <div className="flex flex-col gap-6 p-3 mb-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl p-3 font-semibold">Ingredients</p>
                    <ul className="text-lg flex flex-col gap-3">
                        {
                            p.ingredients.map((ingredient) => {
                                return <li><></></li>
                            })
                        }
                        <li className="">
                            <input className="p-3 w-full rounded-3xl text-center bg-zinc-700" placeholder="What Ingredient?" />
                        </li>
                        <button className="p-3 w-full rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => {p.addIngredient()} }>
                            Add Ingredient
                        </button>
                    </ul>
                </div>
                <div className="flex flex-col gap-6 p-6 mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row items-center gap-6">
                        <img className="w-10" src={ DiscussionIcon } alt="" />
                        <p className="text-2xl font-semibold">Feedbacks</p>
                        <p className="flex text-xl font-semibold justify-end w-full">1.1k</p>
                    </div>
                    <Feedback user={ p.user }/>
                    <Feedback user={ p.user }/>
                    <Feedback user={ p.user }/>
                    <Feedback user={ p.user }/>
                    <Feedback user={ p.user }/>
                    <Feedback user={ p.user }/>
                </div>
            </div>
        </div>
    )
}

export default SidebarBuilder