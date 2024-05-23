import React, { useState, useRef, useLayoutEffect } from 'react'

function CustomTextarea(p) {
    const textareaRef = useRef(null)
    const [isFocused, setIsFocused] = useState(false)
    const keyIndex = p.keyIndex
    const value = p.value
    const placeholder = p.placeholder
    const maxLength = p.maxLength
    const attribute = p.attribute
    const recipeElements = p.recipeElements

    function autoResize() {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }

    useLayoutEffect(() => {
        autoResize()

        function handleResize() {
            autoResize()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [ p.value ])

    function updateValue(value) {
        recipeElements.forEach(element => {
            if (element.key === keyIndex) {
                element.value.contents[0] = value
            }
        })
    }

    return (
        <textarea className={`${ attribute } w-full p-3 box-border rounded-3xl overflow-hidden resize-none`}
            ref={ textareaRef } value={ value } maxLength={ maxLength }
            onChange={ e => updateValue(e.target.value) } placeholder={ placeholder } 
            spellCheck={ isFocused }
            onFocus={ () => { setIsFocused(true) } }
            onBlur={ () => { setIsFocused(false) } }
            rows={ 1 }
        />
    )
}

function RecipeElement(p) {
    const [isHovered, setIsHovered] = useState(false)
    const keyIndex = p.keyIndex
    const value = p.value
    const setValue = p.setValue
    const recipeElements = p.recipeElements
    const setRecipeElements = p.setRecipeElements

    return (
        <div className="py-6 px-3 flex flex-col gap-3 mb-3 text-2xl font-semibold rounded-3xl bg-zinc-900" onMouseEnter={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }}>
            <CustomTextarea attribute={`${ !value[0] && "bg-zinc-700" } px-3 text-3xl font-semibold w-full text-justify focus:bg-zinc-700 bg-transparent`} 
                maxLength={ 50 } keyIndex={ keyIndex } value={ value[0] }
                recipeElements={ recipeElements } placeholder="What do you want to tell?" 
            />
            {
                isHovered && <button className="">Remove</button>
            }
        </div>
    )
}

export default RecipeElement