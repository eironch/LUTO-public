import React, { useState, useLayoutEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Link } from 'react-router-dom'
import Feedback from '../components/Feedback'
import Textarea from '../components/Textarea'
import ProfilePicture from '../assets/profile-picture.png'
import Image from '../assets/placeholder-img.png'
import ApproveIcon from '../assets/approve-icon.png'
import DiscussionIcon from '../assets/discussion-icon.png'
import AddIngredient from '../assets/add-icon.png'

function IngredientForm(p) {
    const keyIndex = p.keyIndex
    const ingredients = p.ingredients
    const setIngredients = p.setIngredients
    const [ingredientValue, setIngredientValue] = useState('')

    useLayoutEffect(() => {
        const newIngredients = [...ingredients]
        newIngredients.forEach(ingredient => {
            if (ingredient.key === keyIndex) {
                ingredient.value = ingredientValue
            }
        })

        setIngredients(newIngredients)
    }, [ingredientValue])

    return (
        <li className="flex rounded-3xl text-center">
            <p className="flex items-center px-3 text-2xl font-bold">•</p>
            <input className="p-3 w-full bg-zinc-900 rounded-3xl focus:bg-zinc-700 hover:bg-zinc-700" value={ ingredientValue } onChange={ e => { setIngredientValue(e.target.value) } } placeholder="What Ingredient?" />
        </li>
    )
}

function SidebarBuilder(p) {
    const user = p.user
    const summary = p.summary
    const setSummary = p.setSummary
    const ingredients = p.ingredients
    const setIngredients = p.setIngredients
    
    function addIngredient() {
        const newIngredients = [...ingredients]
        
        setIngredients([...newIngredients.filter(ingredient => ingredient.value.length > 0), { key: uuidv4(), value: '' }])
    }

    return (
        <div className="pl-3 grid w-full h-full overflow-hidden" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="flex overflow-x-hidden overflow-y-auto h-full scrollable-div flex-col text-zinc-100 col-span-4 pointer-events-auto">
                {/* Recipe Image */}
                <div className="p-2 mb-3 rounded-3xl bg-gradient-to-tr from-orange-500 to-orange-400">
                    <img className="w-full h-auto rounded-3xl object-cover" src={ Image } alt="" />
                    <div className="grid grid-cols-2 pt-2">
                        <div className="flex">
                            <div className="flex gap-3 px-4 py-2 items-center justify-start rounded-3xl hover:bg-orange-400">
                                <button className="hover:underline">
                                    <img className="w-10" src={ DiscussionIcon } alt="" />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex gap-3 px-4 py-2 items-center rounded-3xl hover:bg-orange-400">
                                <button>
                                    <img className="w-10" src={ ApproveIcon } alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* User */}
                <Link to={`/${ user.username }`} className="flex gap-6 flex-row items-center mb-3 p-6 rounded-3xl bg-zinc-900 hover:bg-zinc-500">
                    <img className="w-14" src={ ProfilePicture } alt="" />
                    <p className="text-xl">{ user.username }</p>
                </Link>
                {/* Summary */}
                <div className="flex flex-col p-3 mb-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl font-semibold p-3 mb-3">Summary</p>
                    <Textarea attribute={`${summary ?  "text-justify bg-transparent" : "text-center bg-zinc-700"} text-lg text-lg focus:text-justify focus:bg-zinc-700`} 
                        maxLength={ 300 } value={ summary || "" } setValue={ setSummary }
                        placeholder="What would you describe your dish?"
                    />
                    <p className="p-3 mt-3 w-full flex justify-end">{`${ summary ? summary.length : "0" }/300`}</p>
                </div>
                {/* Ingredients */}
                <div className="flex flex-col gap-3 py-6 px-3 mb-3 rounded-3xl bg-zinc-900">
                    <p className="text-2xl p-3 font-semibold">Ingredients</p>
                    <ul className="text-lg flex flex-col gap-3">
                        {
                            ingredients &&
                            ingredients.map(ingredient => 
                                <IngredientForm 
                                    value={ ingredient.value } key={ ingredient.key } keyIndex={ ingredient.key } 
                                    ingredients={ ingredients } setIngredients={ setIngredients } 
                                />
                            )
                        }
                        <button className="flex justify-center p-3 mt-3 rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { addIngredient() } }>
                            <img className="w-5" src={ AddIngredient } alt="" />
                        </button>
                    </ul>
                </div>
                {/* Feedbacks */}
                <div className="flex flex-col gap-6 p-6 mb-3 rounded-3xl bg-zinc-900">
                    <div className="flex flex-row items-center gap-6">
                        <img className="w-10" src={ DiscussionIcon } alt="" />
                        <p className="text-2xl font-semibold">Feedbacks</p>
                        <p className="flex text-xl font-semibold justify-end w-full"></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SidebarBuilder