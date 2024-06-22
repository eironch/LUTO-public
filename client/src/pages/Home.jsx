import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'

import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'
import SearchBar from '../components/SearchBar'
import FeedbackSection from '../components/FeedbackSection'

function FeedbacksModal(p) {
    const user = p.user
    const formatDate = p.formatDate

    const recipeId = p.recipeId
    const title = p.title
    const feedbackCount = p.feedbackCount
    const setFeedbackCount = p.setFeedbackCount
    const setShowModal = p.setShowModal

    return (
        <div className="absolute inset-0 grid place-items-center h-screen pt-3 text-zinc-100 bg-zinc-950 bg-opacity-90 overflow-y-scroll scrollable-div" 
            onMouseDownCapture={ 
                (event) => { 
                    const isOutsideModal = !event.target.closest('.model-inner')

                    if (isOutsideModal) {
                        setShowModal(false)
                        setFeedbackCount(0)
                    }
                } 
            }
        >
            <div className="flex justify-center w-full h-full items-center">
                <div className="flex flex-col gap-3 justify-center items-center w-5/12 overflow-hidden model-inner">
                        <p className="px-6 text-xl font-semibold text-ellipsis line-clamp-1">{ title }</p>
                        <FeedbackSection 
                            user={ user } recipeId={ recipeId } 
                            feedbackCount={ feedbackCount } setFeedbackCount={ setFeedbackCount } 
                            formatDate={ formatDate }
                        />
                </div>
            </div>
        </div>
    )
}

function Home(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const filters = p.filters
    const setFilters = p.setFilters
    const filtersRef = p.filtersRef
    const approveRecipe = p.approveRecipe
    const formatDate = p.formatDate
    
    const [feedRecipes, setFeedRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevfeedbackCount, setPrevFeedbackCount] = useState()
    
    function fetchFeedRecipes(filters) {
        axios.get('http://localhost:8080/feed-recipes', { params: { userId: user.userId, filters } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
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
        setCurrentTab("Home")
    }, [])
    
    if (currentTab !== "Home") {
        return
    }
    console.log("Home")
    console.log("tab now " + currentTab)
    return (
        <div className="scrollable-div overflow-y-scroll">
            <NavBar 
                user={ user } 
                filters={ filters } setFilters={ setFilters }
                currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
            />
            <div className="flex flex-col pr-0 gap-3 h-svh">
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
                                feedRecipes.map(recipe => 
                                    <RecipeOverview
                                        key={ recipe.recipeId._id } user={ user }
                                        recipeId={ recipe.recipeId._id } recipeImage={ recipe.recipeImage } 
                                        title={ recipe.title } summary={ recipe.summary } 
                                        authorName={ recipe.userId.username } isApproved={ recipe.isApproved } 
                                        approvalCount={ recipe.recipeId.approvalCount } feedbackCount={ recipe.recipeId.feebackCount } 
                                        dateCreated={ recipe.createdAt } recipes={ feedRecipes } 
                                        setRecipes={ setFeedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                        setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                        approveRecipe={ approveRecipe } formatDate={ formatDate }
                                    />
                                )
                            }
                        </div>
                        <div className="col-span-2"></div>
                    </div>
                </div>
                {/* searchbar */}
                { 
                    (currentTab === "Home" || currentTab === "Search" || currentTab === "Settings" ) && 
                    <SearchBar 
                        currentTab={ currentTab } setCurrentTab={setCurrentTab }
                    /> 
                }
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