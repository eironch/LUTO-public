import React, { useState, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import AddElement from '../assets/add-icon.png'

function RecipeBuilder(p) {
    const [summary, setSummary] = useState("")
    const [ingredients, setIngredients] = useState([])
    const [recipeElements, setRecipeElements] = useState({
        userId: p.user.userId,
        categories: [],
        tags: [],
        recipeImage: "",
        title: "",
        summary,
        ingredients: [],
        recipeELements: [{
            contentType: "",
            contents: [],
        }],
    })

    function addIngredient() {
        
    }

    useLayoutEffect(() => {
        p.setCurrentTab("Builder")
    }, [])
    
    return (
        <div>
            <NavBar 
                ingredients={ ingredients } setIngredients={ setIngredients }
                summary={ summary } setSummary={ setSummary }
                recipeElements={ recipeElements } setRecipeElements={ setRecipeElements } 
                user={ p.user } currentTab={ p.currentTab } setCurrentTab={ p.setCurrentTab } 
            />
            <div className="pr-3 flex flex-col gap-3 p-3 h-svh bg-zinc-950">
                <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 rounded-3xl text-zinc-100">
                        <p className="text-2xl font-bold h-16 mb-3 p-6 flex items-center text-zinc-400">
                            What are you cooking?
                        </p>
                        <button className="flex items-center w-full p-6 rounded-3xl bg-orange-500 hover:bg-orange-400">
                            <p className="text-xl font-semibold flex justify-start w-full">Add Recipe Element</p>
                            <div className="flex justify-end">
                                <img className="w-8" src={ AddElement } alt=""/>
                            </div>
                            <div>Text</div>
                        </button>
                    </div>     
                </div>
            </div>
        </div>
    )
}

export default RecipeBuilder