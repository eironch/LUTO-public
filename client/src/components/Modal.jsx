import React, { useEffect, useRef } from 'react'

function Modal(p) {
    const modalTimer = useRef(null);

    useEffect(() => {
        if (p.showModal) {
            clearTimeout(modalTimer)
            modalTimer.current = setTimeout(() => {
                p.setShowModal(false)
            }, 3000)
        }
    }, [p.showModal])

    return (
        <div className={ `fixed inset-0 pt-96 mt-80 flex items-center justify-center transition-transform transform duration-1000 ${
                p.showModal ? "translate-y-0" : "translate-y-full" }` }
                style={{ pointerEvents: 'none' }}
        >
            <div className="rounded-2xl shadow-md mx-auto p-4 px-8 text-lg bg-zinc-700 text-gray-50" >
                <p>{ p.modalMessage }</p>
            </div>
        </div>
    )
}

export default Modal