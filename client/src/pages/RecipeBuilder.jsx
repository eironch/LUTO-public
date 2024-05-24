import React, { useState, useRef, useLayoutEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import Textarea from '../components/Textarea'
import NavBar from '../components/NavBar'
import RecipeElement from '../components/RecipeElement'
import AddElement from '../assets/add-icon.png'

function ElementsModal(p) {
    const setShowModal = p.setShowModal
    const recipeElements = p.recipeElements
    const setRecipeElements = p.setRecipeElements

    function addElement(contentType) {
        setShowModal(false)
        setRecipeElements([...recipeElements, { key: uuidv4(), value:{ contentType, contents: [""] } }])
    }

    return (
        <div className="flex justify-center items-center fixed w-screen h-screen text-zinc-100 bg-zinc-950 bg-opacity-80" 
            onMouseDownCapture={ 
                (event) => { 
                    const isOutsideModal = !event.target.closest('.model-inner')

                    if (isOutsideModal) {
                        setShowModal(false)
                    }
                } 
            }
        >
            <div className="flex flex-col w-4/12 gap-6 p-6 rounded-3xl bg-zinc-900 model-inner">
                <div className="flex justify-end">
                    <button className="p-3 rounded-3xl hover:bg-zinc-500" onClick={ () => { setShowModal(false) } }>X</button>
                </div>
                <p className="text-3xl font-semibold text-center">Add to Recipe</p>
                <ul className="flex flex-col gap-3 h-96 overflow-y-scroll overflow-x-hidden scrollable-div">
                    <li>
                        <button className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { addElement("Text") }}>
                            Text
                        </button>
                    </li>
                    <li>
                        <button className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { addElement("Subheading") }}>
                            Subheading
                        </button>
                    </li>
                    <li>
                        <button className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { addElement("Images") }}>
                            Images
                        </button>
                    </li>
                    <li>
                        <button className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { addElement("Image and Text") }}>
                            Image and Text
                        </button>
                    </li>
                    <li>
                        <button className="flex w-full p-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { addElement("Video") }}>
                            Video
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

function RecipeBuilder(p) {
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const user = p.user

    const [showModal, setShowModal] = useState(false)
    const [summary, setSummary] = useState('')
    const [ingredients, setIngredients] = useState([{ key: uuidv4() }])
    const [title, setTitle] = useState('')
    const [recipeElements, setRecipeElements] = useState([])
    const [recipeContents, setRecipeContents] = useState()

    useLayoutEffect(() => {
        setCurrentTab("Builder")
    }, [])

    return (
        <div>
            <NavBar 
                ingredients={ ingredients } setIngredients={ setIngredients }
                summary={ summary } setSummary={ setSummary } recipeContents={ recipeContents }
                user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
            />
            { showModal && <ElementsModal setShowModal={ setShowModal } recipeElements={ recipeElements } setRecipeElements={ setRecipeElements } /> }
            <div className="pr-0 flex flex-col gap-3 p-3 h-svh overflow-y-scroll scrollable-div bg-zinc-950">
                <div className="grid w-full gap-3" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
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
                        </div>
                        {
                            recipeElements &&
                            recipeElements.map(element => 
                                <RecipeElement
                                    key={ element.key } keyIndex={ element.key } 
                                    contentType={ element.value.contentType }
                                    contents={ element.value.contents } 
                                    recipeElements={ recipeElements } setRecipeElements={ setRecipeElements }
                                />
                            )
                        }
                        <button className="flex items-center w-full mb-3 p-6 rounded-3xl bg-orange-500 hover:bg-orange-400" onClick={ () => { setShowModal(true) } }>
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