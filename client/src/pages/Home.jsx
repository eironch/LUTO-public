import React, { useState, useLayoutEffect } from 'react'
import axios from 'axios'
import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'
import SearchBar from '../components/SearchBar'

function Home(p) {
    const [feedRecipes, setFeedRecipes] = useState([])

    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const user = p.user

    const postApproveRecipe = p.postApproveRecipe

    function getFeedRecipes() {
        axios.get('http://localhost:8080/feed-recipes', { params: { userId:user.userId } })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)

                setFeedRecipes(response.data.payload)
            })
            .catch(err => {
                if (err.response) {
                    console.log('Error Status:', err.response.status)
                    console.log('Error Data:', err.response.data)
                } else if (err.request) {
                    console.log('Error Request:', err.request)
                } else {
                    console.log('Error Message:', err.message)
                }
            })
    }
    
    useLayoutEffect(() => {
    setCurrentTab("Home")
        getFeedRecipes()
    }, [])


    return (
        <div className="scrollable-div overflow-y-scroll">
            <NavBar user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } />
            <div className="pr-0 flex flex-col gap-3 h-svh bg-transparent">
                <div className="flex flex-col gap-3 p-3 pr-0">
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
                            { 
                                feedRecipes.map(recipe => {
                                    return <RecipeOverview key={ recipe.recipeId } recipeId={ recipe.recipeId } title={ recipe.title } summary={ recipe.summary } username={ recipe.userId.username } isApproved={ recipe.isApproved } user={user } postApproveRecipe={ postApproveRecipe }/>
                                })
                            }
                        </div>
                        <div className="col-span-2"></div>
                    </div>
                </div>
                { (currentTab === "Home" || currentTab === "Search" || currentTab === "Settings" ) && <SearchBar currentTab={ currentTab } setCurrentTab={setCurrentTab }/> }
            </div>

        </div>
    )
}

export default Home