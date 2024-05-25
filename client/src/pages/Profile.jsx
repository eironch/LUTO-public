import React, { useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeOverview from '../components/RecipeOverview'
import NavBar from '../components/NavBar'
import Logo from '../assets/luto-logo-gradient.png'

function Profile(p) {
    useLayoutEffect(() => {
        p.setCurrentTab("Profile")
    }, [])

    return (
       <div>
            <NavBar user={ p.user } currentTab={ p.currentTab } setCurrentTab={ p.setCurrentTab } />
            <div className="flex flex-col p-3 pr-0 h-svh bg-zinc-950">
                {/* content */}
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11">
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                    </div>
                </div> 
            </div>
       </div>
    )
}

export default Profile