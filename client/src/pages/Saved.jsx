import React, { useState, useLayoutEffect, useCallback } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'

import NavBar from '../components/NavBar'
import RecipeOverview from '../components/RecipeOverview'
import SearchBar from '../components/SearchBar'
import FeedbacksModal from '../components/FeedbacksModal'
import ConfirmModal from '../components/ConfirmModal'

import RemoveIcon from '../assets/remove-icon.png'
import AllowIcon from '../assets/allow-icon.png'

function Saved(p) {
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
    const handleRemoveRecipe = p.handleRemoveRecipe
    const handleAllowRecipe = p.handleAllowRecipe

    const [savedRecipes, setSavedRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [isConfirmationShown, setIsConfirmationShown] = useState()
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevFeedbackCount, setPrevFeedbackCount] = useState()
    const [moreModalShown, setMoreModalShown] = useState()

    function fetchSavedRecipes(filters) {
        axios.get('http://localhost:8080/saved-recipes', { params: { userId: user.userId, filters } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                setSavedRecipes(res.data.payload)
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)

                if (err.response.status === 400) {
                    return setSavedRecipes([])
                }
            })
    }

    const debouncedFetch = useCallback(
        debounce(() => {
            fetchSavedRecipes(filtersRef.current)
        }, 300), []
    )

    useLayoutEffect(() => {
        filtersRef.current = filters
    }, [filters])

    useLayoutEffect(() => {
        debouncedFetch()
    }, [filters, debouncedFetch])

    useLayoutEffect(() => {
        setCurrentTab('Saved')
    }, [])
    
    if (currentTab !== 'Saved') {
        return
    }

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
                    <div className="col-span-11 h-16 rounded-3xl bg-zinc-900">
                        <div className="grid grid-cols-2 w-full h-16 text-zinc-100 text-3xl font-bold rounded-3xl bg-zinc-900">
                            <div className="flex px-6 pb-1 h-full items-center">
                                Saved Recipes
                            </div>
                            <div className="flex px-6 pb-1 h-full justify-end items-center ">
                                {
                                    (savedRecipes && savedRecipes.length > 0) &&
                                    savedRecipes.length
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2"></div>     
                </div>
                {/* content */}
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="col-span-2"></div>
                    <div className="col-span-11 block">
                        {
                            savedRecipes &&
                            savedRecipes.length > 0 &&
                            savedRecipes.map(recipe => 
                                recipe &&
                                <RecipeOverview
                                    key={ recipe.recipeId } user={ user }
                                    recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                    title={ recipe.title } summary={ recipe.summary } 
                                    authorName={ recipe.userId.username } pointStatus={ recipe.pointStatus } 
                                    points={ recipe.points } feedbackCount={ recipe.feedbackCount } 
                                    dateCreated={ recipe.createdAt } recipes={ savedRecipes } 
                                    setRecipes={ setSavedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                    setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                    prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                    moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                    handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                    handleFlagRecipe={ handleFlagRecipe } flagCount={ recipe.flagCount }
                                    setIsConfirmationShown={ setIsConfirmationShown }
                                />
                            )
                        }
                    </div>
                    <div className="col-span-2"></div>
                </div>
            </div>
            {/* feedbacks modal */}
            {
                isFeedbacksShown &&
                <FeedbacksModal 
                    key={ prevRecipeId }  user={ user } recipeId={ prevRecipeId }
                    title={ prevTitle } feedbackCount={ prevFeedbackCount } 
                    setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                    formatDate={ formatDate } setFeedRecipes={ setSavedRecipes } 
                />
            }
        </div>
    </div>
    )
}

export default Saved