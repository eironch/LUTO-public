import React from 'react'

import GivePointNegativeIcon from '../assets/give-point-negative-icon.png'
import GivenPointNegativeIcon from '../assets/given-point-negative-icon.png'
import GivePointPositiveIcon from '../assets/give-point-positive-icon.png'
import GivenPointPositiveIcon from '../assets/given-point-positive-icon.png'

function PointSection(p) {
    const handleGivePoint = p.handleGivePoint
    const pointStatus = p.pointStatus
    const points = p.points
    
    return (
        <div className="flex justify-end items-center h-fit rounded-3xl bg-zinc-700">
            <button className="flex justify-end items-center p-3 rounded-3xl hover:bg-zinc-500" onClick={ () => { handleGivePoint("negative") } }>
                <img className="min-w-10 w-10" src={ pointStatus === "negative" ? GivenPointNegativeIcon : GivePointNegativeIcon } alt="" />
            </button>
            <p className="text-zinc-100 text-lg font-semibold line-clamp-1">
                { 
                    points ?
                    <>{ points } pts.</>
                    :
                    <>0 pts.</>
                }
            </p>
            <button className="flex justify-end items-center p-3 rounded-3xl hover:bg-zinc-500" onClick={ () => { handleGivePoint("positive") } }>
                <img className="min-w-10 w-10" src={ pointStatus === "positive" ? GivenPointPositiveIcon : GivePointPositiveIcon } alt="" />
            </button>
        </div>
    )
}

export default PointSection