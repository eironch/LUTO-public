import React, { useState, useRef, useLayoutEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import Textarea from '../components/Textarea'
import NavBar from '../components/NavBar'
import RecipeElement from '../components/RecipeElement'
import AddElement from '../assets/add-icon.png'

function RecipeBuilder(p) {
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const user = p.user

    const [summary, setSummary] = useState('')
    const [ingredients, setIngredients] = useState([{ key: uuidv4() }])
    const [title, setTitle] = useState('')
    const [recipeElements, setRecipeElements] = useState([])
    const [recipeContents, setRecipeContents] = useState({
        userId: p.user.userId,
        categories: [],
        tags: [],
        recipeImage: '',
        title: title,
        summary: summary,
        ingredients: ingredients.map(ingredient => ingredient.value),
        recipeElements: recipeElements.map(element => element.value),
    })

    useLayoutEffect(() => {
        setCurrentTab("Builder")
    }, [])
    
    function addElement() {
        setRecipeElements([...recipeElements, { key: uuidv4(), value:{ contentType: "Elements", contents: [""] } }])
    }

    return (
        <div>
            <NavBar 
                ingredients={ ingredients } setIngredients={ setIngredients }
                summary={ summary } setSummary={ setSummary }
                recipeContents={ recipeContents } setRecipeContents={ setRecipeContents } 
                user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
            />
            <div className="pr-3 flex flex-col gap-3 p-3 h-svh bg-zinc-950">
                <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 flex flex-col rounded-3xl text-zinc-100">
                        <p className="text-2xl font-bold h-16 mb-3 p-6 flex items-center text-zinc-400">
                            What are you cooking?
                        </p>
                        <div className="flex flex-col items-center w-full mb-3 py-6 px-3 rounded-3xl bg-zinc-900">
                            <Textarea attribute={`${ !title && "bg-zinc-700" } px-3 text-3xl font-bold w-full text-center focus:bg-zinc-700 bg-transparent`} 
                                maxLength={ 200 } value={ title } setValue={ setTitle } 
                                placeholder="What is the title of your recipe?" 
                            />
                            <button>Add Image</button>
                        </div>
                        {
                            recipeElements &&
                            recipeElements.map(element => 
                                <RecipeElement
                                    key={ element.key } keyIndex={ element.key } 
                                    value={ element.value.contents } recipeElements={ recipeElements }
                                />
                            )
                        }
                        <button className="flex items-center w-full mb-3 p-6 rounded-3xl bg-orange-500 hover:bg-orange-400" onClick={ () => { addElement() } }>
                            <div className="flex w-full justify-center">
                                <img className="w-8" src={ AddElement } alt=""/>
                            </div>
                        </button>
                    </div>     
                </div>
            </div>
        </div>
    )
}

export default RecipeBuilder