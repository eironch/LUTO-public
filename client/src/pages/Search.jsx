import React, { useState, useLayoutEffect } from 'react'
import axios from 'axios'

import NavBar from '../components/NavBar'
import SearchBar from '../components/SearchBar'
import RecipeOverview from '../components/RecipeOverview'
import FeedbacksModal from '../components/FeedbacksModal'

import SearchIcon from '../assets/search-icon.png'

function Search(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const formatDate = p.formatDate

    const filters = p.filters
    const setFilters = p.setFilters
    const searchQuery = p.searchQuery
    const setSearchQuery = p.setSearchQuery
    const handleApproveRecipe = p.handleApproveRecipe

    const [searchedRecipes, setSearchedRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevfeedbackCount, setPrevFeedbackCount] = useState()
    const [isRecipesFind, setRecipesFind] = useState(true)
    
    function handleSearch() {
        if (searchQuery === "") {
            return
        }

        axios.get('http://localhost:8080/find-recipes', { params: { userId: user.userId, searchQuery, filters } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)

                setSearchedRecipes(res.data.payload)
                setRecipesFind(true)
            })
            .catch(err => {
                setSearchedRecipes([])
                setRecipesFind(false)

                console.log(err)
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function handleEnterKey(e) {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    useLayoutEffect(() => {
        setCurrentTab('Search')
        handleSearch()
    }, [])

    if (currentTab !== 'Search') {
        return
    }

    return (
        <div className="overflow-y-scroll scrollable-div">
            <NavBar 
                user={ user }
                filters={ filters } setFilters={ setFilters }
                currentTab={ currentTab } setCurrentTab={ setCurrentTab }
            />
            <div className="flex flex-col gap-3 h-svh">
                <div className="flex flex-col gap-3 p-3 pr-0 h-svh">
                    {/* space for top navbar */}
                    <div className="min-h-52 grid w-full gap-3" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        <div className="flex flex-col justify-center items-center col-span-11 h-full rounded-3xl bg-zinc-900">
                            {/* search context */}
                            <p className="text-zinc-400 text-4xl mt-7 py-1.5 pt-2 overflow-hidden text-ellipsis line-clamp-1 mx-6">
                                What are you looking up?
                            </p> 
                            {/* search bar */}
                            <div className="relative flex my-10 items-center justify-center shadow-md shadow-zinc-950 rounded-3xl m-3 w-8/12 h-10 bg-zinc-700 pointer-events-auto">
                                <div className="absolute flex ml-6 left-0 right-0 items-start justify-left pointer-events-none">
                                    <img className="w-6" src={ SearchIcon } alt="" />
                                </div>
                                <input 
                                    className="w-full px-16 h-10 rounded-3xl bg-transparent text-zinc-100 placeholder:text-zinc-400 text-center" 
                                    value={ searchQuery } onChange={ (e) => setSearchQuery(e.target.value) }
                                    onKeyDown={ e => handleEnterKey(e) }
                                    type="text" placeholder="Search LUTO"
                                />
                                <div className="absolute flex flex-row mr-2 right-0 items-last justify-right pointer-events-none">
                                    <button
                                        className="w-12 h-8 rounded-3xl text-zinc-100 bg-zinc-500 hover:bg-zinc-600 pointer-events-auto" 
                                        onClick={ () => handleSearch() }
                                    >
                                        ➤
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2"></div>     
                    </div>
                    {/* content */}
                    <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                        <div className="col-span-2"></div>
                        {
                            searchedRecipes &&
                            searchedRecipes.length > 0 ?
                            <div className="col-span-11 block">
                                { 
                                    searchedRecipes.map(recipe => 
                                        <RecipeOverview
                                            key={ recipe.recipeId._id } user={ user }
                                            recipeId={ recipe.recipeId._id } recipeImage={ recipe.recipeImage } 
                                            title={ recipe.title } summary={ recipe.summary } 
                                            authorName={ recipe.userId.username } isApproved={ recipe.isApproved } 
                                            points={ recipe.recipeId.points } feedbackCount={ recipe.recipeId.feedbackCount } 
                                            dateCreated={ recipe.createdAt } recipes={ searchedRecipes } 
                                            setRecipes={ setSearchedRecipes } setPrevRecipeId={ setPrevRecipeId }
                                            setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                            handleApproveRecipe={ handleApproveRecipe } formatDate={ formatDate }
                                        />
                                    )
                                }
                            </div>
                            :
                            <div className="col-span-11 flex flex-col p-9 bg-zinc-900 rounded-3xl text-zinc-100">
                                <p className="text-4xl font-bold">
                                    Categories
                                </p>
                            </div>
                        }
                        <div className="col-span-2"></div>
                    </div>
                </div>
                {/* searchbar */}
                {/* <SearchBar 
                    user = { user } currentTab={ currentTab } 
                    setCurrentTab={setCurrentTab } filters={ filters } 
                    searchedRecipes={ searchedRecipes } setSearchedRecipes={ setSearchedRecipes }
                />  */}
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

export default Search