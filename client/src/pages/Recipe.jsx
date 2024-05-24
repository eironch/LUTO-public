import React, { useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Textarea from '../components/Textarea'
import NavBar from '../components/NavBar'

function Recipe(p) {
    const { recipeId } = useParams()
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab

    const [recipeContents, setRecipeContents] = useState()
    const [title, setTitle] = useState()
    const [summary, setSummary] = useState()
    const [ingredients, setIngredients] = useState()
    const [recipeElements, setRecipeElements] = useState()

    // const [recipeContents, setRecipeContents] = useState({
    //     userId: p.user.userId,
    //     categories: [],
    //     tags: [],
    //     recipeImage: '',
    //     title: title,
    //     summary: summary,
    //     ingredients: ingredients.map(ingredient => ingredient.value),
    //     recipeElements: recipeElements.map(element => element.value),
    // })
    
    useLayoutEffect(() => {
        axios.get('http://localhost:8080/recipe', { params: { recipeId, userId: user.userId } })
        .then(response => {
            console.log('Status Code:' , response.status)
            console.log('Data:', response.data)
            console.log(response.data.payload[0].recipeContents.recipeElements)
            setRecipeContents(response.data.payload[0].recipeContents)
            setTitle(response.data.payload[0].recipeContents.title)
            setSummary(response.data.payload[0].recipeContents.summary)
            console.log(response.data.payload[0].recipeContents.ingredients)
            setIngredients(response.data.payload[0].recipeContents.ingredients)
            setRecipeElements(response.data.payload[0].recipeContents.recipeElements)
            
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
    }, [recipeId])

    useLayoutEffect(() => {
        setCurrentTab("Recipe")
    }, [])

    return (
        <div>
            <NavBar 
                ingredients={ ingredients } setIngredients={ setIngredients }
                summary={ summary } setSummary={ setSummary } recipeContents={ recipeContents }
                user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
            />
            <div className="pr-0 flex flex-col gap-3 p-3 pb-0 h-svh overflow-y-scroll scrollable-div bg-zinc-950">
                <div className="grid w-full gap-3" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 flex flex-col rounded-3xl text-zinc-100">
                        <div className="flex flex-col items-center w-full mb-3 py-6 px-3 rounded-3xl bg-zinc-900">
                            <Textarea attribute={`${ !title && "bg-zinc-700" } px-3 text-3xl font-bold w-full text-center focus:bg-zinc-700 bg-transparent`} 
                                maxLength={ 200 } value={ title } setValue={ setTitle } 
                                placeholder="What is the title of your recipe?" 
                            />
                        </div>
                        {
                            recipeElements &&
                            recipeElements.map(element => {
                                if (element.contentType === "Subheading") {
                                    return (
                                        <div className="py-6 px-3 flex flex-col gap-3 mb-3 rounded-3xl bg-zinc-900">
                                            <p className="px-3 text-3xl font-semibold w-full text-justify">{ element.contents[0] }</p>
                                        </div>
                                    )
                                } else if (element.contentType === "Text") {
                                    return (
                                        <div className="py-6 px-3 flex flex-col gap-3 mb-3 rounded-3xl bg-zinc-900">
                                            <p className="px-3 text-xl w-full text-justify">{ element.contents[0] }</p>
                                        </div>
                                    )
                                }
                                
                                return null
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Recipe