import React, { useLayoutEffect } from 'react'
import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'

function Home(p) {
    useLayoutEffect(() => {
        p.setCurrentTab("Home")
    })

    return (
        <div>
            <NavBar username={ p.username } currentTab={ p.currentTab } setCurrentTab={ p.setCurrentTab } />
            <div className="pr-0 flex flex-col gap-3 p-3 h-svh bg-zinc-950">
                {/* space for top navbar */}
                <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-2"></div>
                    <div className="col-span-11 h-16 rounded-3xl bg-zinc-900"></div>
                    <div className="col-span-2"></div>     
                </div>
                {/* content */}
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-2"></div>
                    <div className="col-span-11 block">
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                        <RecipeOverview />
                    </div>
                    <div className="col-span-2"></div>
                </div>
            </div>
        </div>
    )
}

export default Home