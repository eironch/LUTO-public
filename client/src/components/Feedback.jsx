import React from 'react'
import ProfilePicture from '../assets/profile-picture.png'
import MoreIcon from '../assets/more-icon.png'

function Feedback(p) {
    return (
        <div className="flex flex-row gap-4">
            <div className="h-full w-12">
                <img className="" src={ ProfilePicture } alt="" />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-row font-semibold">
                    <div className="flex flex-row w-full">
                        <p>{ p.username }&nbsp;•&nbsp;</p>
                        <p className="text-zinc-400">said 18 hours ago</p>
                    </div>
                    <button className="flex px-3 items-center justify-center rounded-3xl hover:bg-zinc-500">
                        <img className="w-5" src={ MoreIcon } alt="" />
                    </button>
                </div>
                <p>This recipe is really great! I have tried it last week, had a rought time with how much seasong I should put but it was all worth it! My friends loved it!</p>
            </div>
        </div>
       
    )
}

export default Feedback