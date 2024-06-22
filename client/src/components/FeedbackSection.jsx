import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Textarea from '../components/Textarea'

import ProfilePicture from '../assets/profile-picture.png'
import MoreIcon from '../assets/more-icon.png'
import FeedbackIcon from '../assets/feedback-icon.png'

function Feedback(p) {
    const username = p.username
    const text = p.text
    const createdAt = p.createdAt
    const formatDate = p.formatDate

    const [formattedDate, setFormattedDate] = useState()

    useEffect(() => {
        setFormattedDate(formatDate(new Date(createdAt)))
    })

    return (
        <div className="flex flex-row gap-4">
            <div className="h-full w-12">
                <img className="" src={ ProfilePicture } alt="" />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex flex-row font-semibold">
                    <div className="flex flex-row items-center w-full">
                        <span>{ username }&nbsp;</span>
                        <p className="text-sm text-zinc-400">
                            • said { formattedDate }
                        </p>
                    </div>
                    <button className="flex px-3 items-center justify-center rounded-3xl hover:bg-zinc-500">
                        <img className="w-5" src={ MoreIcon } alt="" />
                    </button>
                </div>
                <p>{ text }</p>
            </div>
        </div>
    )
}

function FeedbackSection(p) {
    const user = p.user
    const formatDate = p.formatDate
    
    const recipeId = p.recipeId
    const feedbackCount = p.feedbackCount
    const setFeedbackCount = p.setFeedbackCount
    
    const [userFeedback, setUserFeedback] = useState()
    const [feedbacks, setFeedbacks] = useState()
    console.log(recipeId)
    function getFeedbacks() {
        axios.get('http://localhost:8080/feedbacks', { params: { recipeId } })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                console.log("whye")
                setFeedbackCount(feedbackCount + 1)
                setFeedbacks(res.data.payload.feedbacks)
                setFeedbackCount(res.data.payload.feedbackCount.feedbackCount)
            })
            .catch(err => {
                console.log('Error Status:', err.res.status)
                console.log('Error Data:', err.res.data)
            })
    }
    console.log("tab right now " + p.currentTab)

    function submitFeedback() {
        setUserFeedback('')

        axios.post('http://localhost:8080/submit-feedback', { userId: user.userId, recipeId, text: userFeedback })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)

                getFeedbacks()
            })
            .catch(err => {
                console.log('Error Status:', err.res.status)
                console.log('Error Data:', err.res.data)
            })
    }

    useEffect(() => {
        getFeedbacks()
    }, [])

    return (
        <div className="flex flex-col w-full mb-3 rounded-3xl bg-zinc-900 overflow-hidden">
            {/* header */}
            <div className="flex flex-row items-center p-6 gap-6 shadow-md shadow-zinc-950">
                <img className="w-10" src={ FeedbackIcon } alt="" />
                <p className="text-2xl font-semibold">Feedbacks</p>
                <p className="flex pr-3 text-2xl font-semibold justify-end w-full">
                    { feedbackCount > 0 && feedbackCount }
                </p>
            </div>
            {/* feedback input */}
            <div className="flex flex-row items-center p-6 -mb-3 gap-3">
                <img className="w-10" src={ ProfilePicture } alt="" />
                <Textarea 
                    attribute="w-full text-justify text-md bg-zinc-700 focus:bg-zinc-700" 
                    maxLength={ 500 } value={ userFeedback || "" } setValue={ setUserFeedback }
                    placeholder="Got Feedbacks?"
                />
                <button className={`${ userFeedback ? "hover:bg-zinc-500 bg-zinc-700" : "bg-zinc-800" } p-3 rounded-3xl disabled:cursor-not-allowed`} 
                    disabled={ !userFeedback } onClick={ () => { submitFeedback() } }
                >
                    Send
                </button>
            </div>
            {/* user feedbacks */}
            {
                feedbacks &&
                feedbacks.length > 0 ?
                <div className="flex flex-col p-6 gap-6">
                    {
                        feedbacks.map(feedback => 
                            <Feedback 
                                key={ feedback._id } username={ feedback.userId.username }
                                text={ feedback.text } createdAt={ feedback.createdAt } 
                                formatDate={ formatDate }
                            />
                        )
                    }
                </div>
                :
                <div className="pb-3"></div>
            }
        </div>
        
    )
}

export default FeedbackSection