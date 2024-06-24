import React, { useState, useCallback, useLayoutEffect } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'

import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'
import SearchBar from '../components/SearchBar'
import FeedbacksModal from '../components/FeedbacksModal'

function Home(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const formatDate = p.formatDate
    
    const filters = p.filters
    const setFilters = p.setFilters
    const filtersRef = p.filtersRef
    const searchQuery = p.searchQuery
    const setSearchQuery = p.setSearchQuery
    const handleGiveRecipePoint = p.handleGiveRecipePoint
    const handleFlagRecipe = p.handleFlagRecipe

    const [feedRecipes, setFeedRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevfeedbackCount, setPrevFeedbackCount] = useState()
    const [moreModalShown, setMoreModalShown] = useState()

    function fetchFeedRecipes(filters) {
        axios.get('http://localhost:8080/feed-recipes', { params: { userId: user.userId, filters } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                console.log("fetched")
                setFeedRecipes(res.data.payload)
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                if (err.response.status === 400) {
                    return setFeedRecipes([])
                }
            })
    }

    const debouncedFetch = useCallback(
        debounce(() => {
            fetchFeedRecipes(filtersRef.current)
        }, 300), []
    )

    useLayoutEffect(() => {
        filtersRef.current = filters
    }, [filters])

    useLayoutEffect(() => {
        debouncedFetch()
    }, [filters, debouncedFetch])

    useLayoutEffect(() => {
        setCurrentTab('Home')
    }, [])
    
    if (currentTab !== 'Home') {
        return
    }
    console.log("Home")
    console.log("tab now " + currentTab)
    return (
        <div className="overflow-y-scroll scrollable-div">
            <NavBar 
                user={ user } 
                filters={ filters } setFilters={ setFilters }
                currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
            />
            <div className="flex flex-col pr-0 gap-3 h-svh">
                <div className="flex flex-col gap-3 p-3 pr-0">
                    {/* space for top navbar */}
                    <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        <div className="col-span-11 h-16 rounded-3xl bg-zinc-900"></div>
                        <div className="col-span-2"></div>     
                    </div>
                    {/* content */}
                    <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        <div className="col-span-11 block">
                            { 
                                feedRecipes.map(recipe => 
                                    <RecipeOverview
                                        key={ recipe.recipeId._id } user={ user }
                                        recipeId={ recipe.recipeId._id } recipeImage={ recipe.recipeImage } 
                                        title={ recipe.title } summary={ recipe.summary } 
                                        authorName={ recipe.userId.username } pointStatus={ recipe.pointStatus } 
                                        points={ recipe.recipeId.points } feedbackCount={ recipe.recipeId.feedbackCount } 
                                        dateCreated={ recipe.createdAt } recipes={ feedRecipes } 
                                        setRecipes={ setFeedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                        setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                        moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                        handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                        handleFlagRecipe={ handleFlagRecipe }
                                    />
                                )
                            }
                        </div>
                        <div className="col-span-2"></div>
                    </div>
                </div>
                {/* searchbar */} 
                <SearchBar searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } />
                {/* feedbacks modal */}
                {
                    isFeedbacksShown &&
                    <FeedbacksModal 
                        user={ user } recipeId={ prevRecipeId }
                        title={ prevTitle } feedbackCount={ prevfeedbackCount } 
                        setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                        formatDate={ formatDate }
                    />
                }
            </div>
        </div>
    )
}

export default Home