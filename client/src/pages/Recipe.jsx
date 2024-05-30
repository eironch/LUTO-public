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

    const [recipeImage, setRecipeImage] = useState()
    const [title, setTitle] = useState()
    const [summary, setSummary] = useState()
    const [ingredients, setIngredients] = useState()
    const [recipeElements, setRecipeElements] = useState()
    
    useLayoutEffect(() => {
        axios.get('http://localhost:8080/recipe', { params: { recipeId, userId: user.userId } })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)
  
                setRecipeImage(response.data.payload.recipeContents.recipeImage)
                setTitle(response.data.payload.recipeContents.title)
                setSummary(response.data.payload.recipeContents.summary)
                setIngredients(response.data.payload.recipeContents.ingredients)
                setRecipeElements(response.data.payload.recipeContents.recipeElements)
                
            })
            .catch(err => {
                console.log("err")
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
                recipeImage = { recipeImage }
                summary={ summary } setSummary={ setSummary }
                ingredients={ ingredients } setIngredients={ setIngredients }
                user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
            />
            <div className="pr-0 flex flex-col gap-3 p-3 pb-0 h-svh overflow-y-scroll scrollable-div bg-zinc-950">
                <div className="grid w-full gap-3" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                    <div className="col-span-4"></div>
                    <div className="col-span-11 flex flex-col rounded-3xl text-zinc-100">
                        <div className="flex flex-col items-center w-full mb-3 py-6 px-3 rounded-3xl bg-zinc-900">
                            <p attribut="px-3 text-3xl font-bold w-full text-center focus:bg-zinc-700">
                            { title }
                            </p>
                        </div>
                        {
                            recipeElements &&
                            recipeElements.map((element, key) => {
                                console.log(recipeElements)
                                if (element.contentType === "Subheading") {
                                    return (
                                        <div className="py-6 px-3 flex flex-col gap-3 mb-3 rounded-3xl bg-zinc-900" key={ key }>
                                            <p className="px-3 text-3xl font-semibold w-full text-justify">{ element.contents[0] }</p>
                                        </div>
                                    )
                                } else if (element.contentType === "Text") {
                                    return (
                                        <div className="py-6 px-3 flex flex-col gap-3 mb-3 rounded-3xl bg-zinc-900" key={ key }>
                                            <p className="px-3 text-xl w-full text-justify">{ element.contents[0] }</p>
                                        </div>
                                    )
                                } else if (element.contentType === "Images") {
                                    return (
                                        <div className="pt-6 pb-3 px-6 flex flex-col justify-center items-center gap-3 mb-3 rounded-3xl overflow-hidden bg-zinc-900" key={ key }>
                                            <div className={`${ element.files.length > 2 ? "lg:justify-start" : "lg:justify-center" } flex flex-row w-full h-full gap-3 items-center overflow-x-scroll scrollable-div md:justify-start`}>
                                                {
                                                    element.files.map((file, index) => (
                                                        <div className="w-96 h-96 aspect-w-2 flex-none" key={ index }>
                                                            <div className="bg-zinc-700 rounded-3xl">
                                                                <img className="absolute inset-0 w-full h-full rounded-3xl object-cover" src={ file } alt="" />
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
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