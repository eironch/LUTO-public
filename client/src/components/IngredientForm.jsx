import React from 'react'

function IngredientForm(p) {
    const index = p.index
 
    function updateIngredient(ingredient) {
        const newIngredients = [...p.ingredients]
        newIngredients[index] = ingredient
        p.setIngredients(newIngredients)
    }

    return (
        <li className="flex rounded-3xl text-center">
            <p className="flex items-center px-3 text-2xl font-bold">•</p>
            <input className="p-3 w-full bg-zinc-900 rounded-3xl focus:bg-zinc-700 hover:bg-zinc-700" onChange={ e => { updateIngredient(e.target.value) } } placeholder="What Ingredient?" />
        </li>
    )
}

export default IngredientForm