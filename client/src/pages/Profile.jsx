import React, { useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import RecipeOverview from '../components/RecipeOverview'
import NavBar from '../components/NavBar'

function Profile(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const approveRecipe = p.approveRecipe
    const formatDate = p.formatDate
    
    const { authorName } = useParams()
    const [userRecipes, setUserRecipes] = useState([])

    useLayoutEffect(() => {
        axios.get('http://localhost:8080/user-recipes', { params: { authorName } })
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

    useLayoutEffect(() => {
        setCurrentTab("Profile")
    }, [])

    if (currentTab !== "Profile") {
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
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 block">
                        { 
                            userRecipes.map((recipe, index) => {
                                return <RecipeOverview 
                                    key={ index } user={ user } 
                                    recipeId={ recipe.recipeId._id } recipeImage={ recipe.recipeImage } 
                                    title={ recipe.title } summary={ recipe.summary } 
                                    authorName={ authorName } isApproved={ recipe.isApproved } 
                                    approvalCount={ recipe.recipeId.approvalCount } recipes={ userRecipes } 
                                    setRecipes={ setUserRecipes } dateCreated={ recipe.createdAt }
                                    approveRecipe={ approveRecipe } formatDate={ formatDate }
                                />
                            })
                        }
                    </div>
                </div> 
            </div>
       </div>
    )
}

export default Profile