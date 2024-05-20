import React, { useRef, useLayoutEffect } from 'react'
import { ScrollRestoration } from 'react-router-dom'

function Textarea(p) {
    const textareaRef = useRef(null)

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

    return (
        <textarea className={`${ !p.value ?  "text-center" : "text-justify" } focus:text-justify  w-full text-lg p-3 box-border rounded-3xl bg-zinc-700 overflow-hidden resize-none`}
            ref={ textareaRef } value={ p.value } maxLength={ p.maxLength }
            onChange={ e => { p.setValue(e.target.value) } } placeholder={ p.placeholder } 
        />
    )
}

export default Textarea