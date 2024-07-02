import React, { useEffect, useRef } from 'react'

function Modal(p) {
    const modalTimer = useRef(null)

    useEffect(() => {
        if (p.showModal) {
            clearTimeout(modalTimer)
            modalTimer.current = setTimeout(() => {
                p.setShowModal(false)
            }, 3000)
        }
    }, [p.showModal])

    return (
        <div className={`${ p.showModal ? "translate-y-0" : "translate-y-full" } fixed inset-0 pt-96 mt-80 flex items-center justify-center transition-transform transform duration-1000 pointer-events-none`}>
            <div className="rounded-2xl shadow-md shadow-zinc-950 mx-auto p-4 px-8 text-lg bg-zinc-600 text-gray-50" >
                <p>{ p.modalMessage }</p>
            </div>
        </div>
    )
}

export default Modal