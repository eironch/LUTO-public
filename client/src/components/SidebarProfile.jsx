import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import ProfilePicture from '../assets/profile-picture.png'

function SidebarProfile(p) {
    const user = p.user
    const authorName = p.authorName
    
    const [isFollowed, setIsFollowed] = useState()
    const [followCount, setFollowCount] = useState(0)

    function handleFollowUser() {
        setIsFollowed(!isFollowed)

        axios.post('http://localhost:8080/follow-user', { userId: user.userId, authorName })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setIsFollowed(res.data.payload.isFollowed)
                setFollowCount(res.data.payload.followCount)
            })
            .catch(err => {
                console.log(err)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                setIsFollowed(!isFollowed)
            })
    }

    function handleGetUserFollows() {
        axios.get('http://localhost:8080/get-follows', { params: { userId: user.userId, authorName } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setIsFollowed(res.data.payload.isFollowed)
                setFollowCount(res.data.payload.followCount)
            })
            .catch(err => {
                console.log(err)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    useEffect(() => {
        handleGetUserFollows()
    }, [])

    return (
        <div className="grid pl-3 w-full h-full overflow-hidden" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="flex flex-col gap-3 text-zinc-100 col-span-4 pointer-events-auto overflow-y-scroll scrollable-div">
                {/* user  */}
                <div className="flex flex-row p-6 gap-6 items-center text-2xl rounded-3xl bg-zinc-900">
                    <img className="w-28" src={ ProfilePicture } alt="" />
                    <div className="grid grid-row-2 w-full gap-3">
                        <div className="flex flex-row h-12 pr-1 items-center">
                            <p className="px-1 w-full font-semibold overflow-hidden">
                                { authorName }
                            </p>
                            {
                                isFollowed !== undefined &&
                                user.username !== authorName &&
                                <button className={`${ isFollowed ? "text-zinc-400 border-2 border-orange-500 hover:border-orange-400" : "bg-orange-500 hover:bg-orange-400" } w-full h-fit py-1 rounded-3xl text-lg text-center font-semibold gap-4 overflow-hidden`} onClick={ () => { handleFollowUser() } }>
                                    {
                                        isFollowed ?
                                        "Unfollow"
                                        :
                                        "Follow"
                                    }
                                </button>
                            }
                        </div>
                        <p className="px-1 text-lg">
                            { followCount } followers
                        </p>
                    </div>
                </div>
                {/* bio */}
                <div className="flex flex-col gap-3 p-6 rounded-3xl bg-zinc-900">
                    <p className="text-2xl font-semibold">Bio</p>
                    <p className="w-full">
                        An aspiring cook from the Pearl of the Orient Sea, the Philippines. Here to learn and be part of the cooking community.
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
