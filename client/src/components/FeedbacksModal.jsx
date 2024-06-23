import React from 'react'
import FeedbackSection from '../components/FeedbackSection'

function FeedbacksModal(p) {
    const user = p.user
    const formatDate = p.formatDate

    const recipeId = p.recipeId
    const title = p.title
    const feedbackCount = p.feedbackCount
    const setFeedbackCount = p.setFeedbackCount
    const setShowModal = p.setShowModal

    return (
        <div className="absolute inset-0 grid place-items-center h-screen pt-3 text-zinc-100 bg-zinc-950 bg-opacity-90 overflow-y-scroll scrollable-div" 
            onMouseDownCapture={ 
                (event) => { 
                    const isOutsideModal = !event.target.closest('.model-inner')

                    if (isOutsideModal) {
                        setShowModal(false)
                        setFeedbackCount(0)
                    }
                } 
            }
        >
            <div className="flex justify-center w-full h-full items-center">
                <div className="flex flex-col gap-3 justify-center items-center w-5/12 overflow-hidden model-inner">
                        <p className="px-6 text-xl font-semibold text-ellipsis line-clamp-1">{ title }</p>
                        <FeedbackSection 
                            user={ user } recipeId={ recipeId } 
                            feedbackCount={ feedbackCount } setFeedbackCount={ setFeedbackCount } 
                            formatDate={ formatDate }
                        />
                </div>
            </div>
        </div>
    )
}

export default FeedbacksModal