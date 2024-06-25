import React, { useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import RecipeOverview from '../components/RecipeOverview'
import NavBar from '../components/NavBar'
import FeedbacksModal from '../components/FeedbacksModal'
import ConfirmModal from '../components/ConfirmModal'

import RemoveIcon from '../assets/remove-icon.png'
import AllowIcon from '../assets/allow-icon.png'

function Profile(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const handleGiveRecipePoint = p.handleGiveRecipePoint
    const formatDate = p.formatDate
    const handleFlagRecipe = p.handleFlagRecipe
    const handleRemoveRecipe = p.handleRemoveRecipe
    const handleAllowRecipe = p.handleAllowRecipe

    
    const { authorName } = useParams()
    const [userRecipes, setUserRecipes] = useState([])
    const [isFeedbacksShown, setIsFeedbacksShown] = useState(false)
    const [isConfirmationShown, setIsConfirmationShown] = useState()
    const [prevRecipeId, setPrevRecipeId] = useState()
    const [prevTitle, setPrevTitle] = useState()
    const [prevFeedbackCount, setPrevFeedbackCount] = useState()
    const [moreModalShown, setMoreModalShown] = useState()

    useLayoutEffect(() => {
        axios.get('http://localhost:8080/user-recipes', { params: { userId: user.userId, authorName, sort: user.accountType === "user" ? { createdAt: -1 } : { flagCount: 1 } } })
            .then(res => {
                console.log('Status Code:', res.status)
                console.log('Data:', res.data)
                
                setUserRecipes(res.data.payload)
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }, [authorName])

    
    function removeRecipe() {
        handleRemoveRecipe(user.userId, prevRecipeId)
        
        setIsConfirmationShown()

        setUserRecipes(userRecipes.filter(recipe => recipe.recipeId !== prevRecipeId))
    }

    function allowRecipe() {
        handleAllowRecipe(prevRecipeId)
        
        setIsConfirmationShown()
        
        setUserRecipes(userRecipes.filter(recipe => recipe.recipeId !== prevRecipeId))
    }

    useLayoutEffect(() => {
        setCurrentTab('Profile')
    }, [])

    if (currentTab !== 'Profile') {
        return
    }

    return (
       <div className="scrollable-div overflow-y-scroll">
            <NavBar
                user={ user }authorName={ authorName } 
                currentTab={ currentTab } setCurrentTab={ setCurrentTab }
            />
            <div className="flex flex-col p-3 pr-0 h-svh bg-zinc-950">
                {/* content */}
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 block">
                        { 
                            userRecipes.map((recipe, index) => {
                                return <RecipeOverview 
                                    key={ index } user={ user } 
                                    recipeId={ recipe.recipeId } recipeImage={ recipe.recipeImage } 
                                    title={ recipe.title } summary={ recipe.summary } 
                                    authorName={ authorName } pointStatus={ recipe.pointStatus } 
                                    points={ recipe.points } recipes={ userRecipes } 
                                    setRecipes={ setUserRecipes } dateCreated={ recipe.createdAt }
                                    handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                                    feedbackCount={ recipe.feedbackCount } setPrevRecipeId={ setPrevRecipeId }
                                    setPrevTitle={ setPrevTitle } setIsFeedbacksShown={ setIsFeedbacksShown }
                                    prevRecipeId={ prevRecipeId } prevFeedbackCount={ prevFeedbackCount } 
                                    moreModalShown={ moreModalShown } setMoreModalShown={ setMoreModalShown }
                                    handleFlagRecipe={ handleFlagRecipe } flagCount={ recipe.flagCount }
                                    setIsConfirmationShown={ setIsConfirmationShown } allowRecipe={ allowRecipe }
                                />
                            })
                        }
                    </div>
                </div> 
                {/* feedbacks modal */}
                {
                    isFeedbacksShown &&
                    <FeedbacksModal 
                        user={ user } recipeId={ prevRecipeId }
                        title={ prevTitle } feedbackCount={ prevFeedbackCount } 
                        setFeedbackCount={ setPrevFeedbackCount } setShowModal={ setIsFeedbacksShown } 
                        formatDate={ formatDate } setFeedRecipes={ setUserRecipes } 
                    />
                }
                {/* confirm modal */}
                {
                    isConfirmationShown === "remove" &&
                    <ConfirmModal 
                        setShowModal={ setIsConfirmationShown } confirmAction={ removeRecipe }
                        title={ prevTitle } headerText={ "Confirm Removal" }
                        bodyText={ "Make sure to thoroughly check whether it goes against our content policy. By removing this, your user ID will be saved as the remover." }
                        icon={ RemoveIcon } isDanger={ true }
                    />
                }
                {
                    isConfirmationShown === "allow" &&
                    <ConfirmModal 
                        setShowModal={ setIsConfirmationShown } confirmAction={ allowRecipe }
                        title={ prevTitle } headerText={ "Confirm Clearance" } 
                        bodyText={ "Make sure to thoroughly check whether it is in adherance with our content policy." }
                        icon={ AllowIcon } isDanger={ false }
                    />
                }
            </div>
       </div>
    )
}

export default Profile