import React, { useState, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'

import FeedbackIcon from '../assets/feedback-icon.png'
import ApproveIcon from '../assets/approve-icon.png'
import ApprovedIcon from '../assets/approved-icon.png'

function RecipeOverview(p) {
    const user = p.user
    const recipes = p.recipes
    const setRecipes = p.setRecipes
    const authorName = p.authorName
    const recipeId = p.recipeId
    const title = p.title
    const summary = p.summary
    const recipeImage = p.recipeImage
    const approvalCount = p.approvalCount
    const feedbackCount = p.feedbackCount
    const setPrevRecipeId = p.setPrevRecipeId
    const setPrevTitle = p.setPrevTitle
    const setIsFeedbacksShown = p.setIsFeedbacksShown
    const approveRecipe = p.approveRecipe
    const formatDate = p.formatDate
    
    const dateCreated = new Date(p.dateCreated)
    const [isApproved, setIsApproved] = useState(p.isApproved)
    const [formattedDate, setFormattedDate] = useState('')
    
    async function handleApproveRecipe() {
        const { isApproved, approvalCount } = await approveRecipe(user.userId, recipeId)
        
        setRecipes(recipes.map(recipe => {
            if (recipe.recipeId._id === recipeId) {
                recipe.recipeId.approvalCount = approvalCount
            }

            return recipe
        }))
        
        setIsApproved(isApproved)
    }

    function handlePrevFeedbacks() {
        setPrevRecipeId(recipeId)
        setPrevTitle(title)
        setIsFeedbacksShown(true)
    }

    useLayoutEffect(() => {
        setFormattedDate(formatDate(dateCreated))
    }, [])

    return (
        <div className="grid grid-cols-12 mb-3 rounded-3xl bg-zinc-900 overflow-hidden">
            {/* recipe image */}
            <Link to={`/recipe/${ recipeId }`}  className="flex col-span-4 rounded-3xl p-2 shadow-zinc-950 shadow-right bg-gradient-to-br from-orange-600 to-orange-400">
                <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden">
                    <img className="w-full h-full rounded-3xl object-cover" src={ recipeImage } alt="" />
                </div>
            </Link>
            {/* recipe content */}
            <div className="col-span-8 flex flex-col">
                <div className="flex flex-col w-full min-h-64 gap-3">
                    <Link to={`/recipe/${ recipeId }`} className="mx-6 mt-6 pb-1 text-zinc-100 text-3xl font-bold line-clamp-2 hover:underline">
                        { title }
                    </Link>
                    <div className="flex flex-row mx-6 -m-1 text-lg overflow-hidden text-clip text-zinc-400">
                        <Link to={`/${ authorName }`} className="hover:underline">
                            { authorName }
                        </Link>
                        <p className="line-clamp-1">
                            ’s recipe •&nbsp;
                        </p>
                        <p className="line-clamp-1">
                            { formattedDate }
                        </p>
                    </div>
                    <p className="mx-6 text-zinc-100 text-lg text-ellipsis overflow-hidden line-clamp-4">
                        { summary }
                    </p>
                </div>
                <div className="flex mb-6 ml-6 h-full gap-6">
                    <div className="flex items-end w-full text-zinc-100 text-lg overflow-hidden">
                        <button className="flex items-center px-4 py-2 gap-4 rounded-3xl hover:bg-zinc-500" onClick={ () => handlePrevFeedbacks() }>
                            <img className="w-10" src={ FeedbackIcon } alt="" />
                            { 
                                feedbackCount > 0 && 
                                <p>{ feedbackCount }</p>
                            }
                        </button>
                    </div>
                    <div className="flex justify-end items-end w-full mr-6 gap-4 text-zinc-100 text-lg overflow-hidden">
                        <button className="flex justify-end items-center px-4 py-2 gap-4 rounded-3xl hover:bg-zinc-500" onClick={ () => { handleApproveRecipe() } }>
                            { 
                                approvalCount > 0 && 
                                <p>{ approvalCount }</p>
                            }
                            <img className="w-10" src={ isApproved ? ApprovedIcon : ApproveIcon } alt="" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipeOverview