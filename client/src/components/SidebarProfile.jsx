import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import ProfileIcon from '../assets/profile-icon.png'

function SidebarProfile(p) {
    const user = p.user
    const authorName = p.authorName
    
    const [isFollowed, setIsFollowed] = useState()
    const [followCount, setFollowCount] = useState(0)
    const [followers, setFollowers] = useState()
    const [authorBio, setAuthorBio] = useState('')
    const [authorProfilePicture, setAuthorProfilePicture] = useState()

    function handleFollowUser() {
        setIsFollowed(!isFollowed)

        axios.post('http://localhost:8080/follow-user', { userId: user.userId, authorName })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setIsFollowed(res.data.payload.isFollowed)
                setFollowCount(res.data.payload.followCount)
                setFollowers(res.data.payload.followers)
            })
            .catch(err => {
                console.log(err)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                setIsFollowed(!isFollowed)
            })
    }

    function handleAuthorInfo() {
        axios.get('http://localhost:8080/get-author-info', { params: { userId: user.userId, authorName } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setIsFollowed(res.data.payload.isFollowed)
                setFollowCount(res.data.payload.followCount)
                setFollowers(res.data.payload.followers)
                setAuthorProfilePicture(res.data.payload.profilePicture)
                setAuthorBio(res.data.payload.bio)
            })
            .catch(err => {
                console.log(err)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    useEffect(() => {
        setIsFollowed()
        setFollowCount()
        setFollowers()
        setAuthorProfilePicture()
        setAuthorBio()
        handleAuthorInfo()
    }, [authorName])

    return (
        <div className="grid pl-3 w-full h-full overflow-hidden" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="flex flex-col gap-3 text-zinc-100 col-span-4 pointer-events-auto overflow-y-scroll scrollable-div">
                {/* user  */}
                <div className="flex flex-row p-6 gap-6 items-center text-2xl rounded-3xl bg-zinc-800">
                    <img className="w-28 h-28 aspect-1 rounded-full object-cover" src={ authorProfilePicture || ProfileIcon } alt="" />
                    <div className="grid grid-row-2 w-full gap-3 overflow-hidden">
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
                        <p className="px-1 text-lg line-clamp-1">
                            { followCount } followers
                        </p>
                    </div>
                </div>
                {/* bio */}
                {
                    authorBio &&
                    <div className="flex flex-col gap-3 p-6 rounded-3xl bg-zinc-800">
                        <p className="text-2xl font-semibold">Bio</p>
                        <p className="w-full">
                            { authorBio }                        
                        </p>
                    </div>
                }
                {/* friends */}
                <div className="flex flex-col gap-3 p-3 rounded-3xl bg-zinc-800">
                    <p className="text-2xl px-3 pt-3 font-semibold">Followers</p>
                    <div className="flex flex-col gap-3">
                        {
                            followers &&
                            followers.length > 0 &&
                            followers.map(follower => 
                                <Link to={`/${ follower.username }`} className="flex flex-row items-center p-3 gap-6 text-xl rounded-3xl hover:bg-zinc-500">
                                    <img className="w-16 h-16 aspect-1 rounded-full object-cover" src={ follower.profilePicture || ProfileIcon } alt="" />
                                    <p>{ follower.username }</p>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SidebarProfile
