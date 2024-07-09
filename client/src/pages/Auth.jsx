import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import AuthForm from '../components/AuthForm'

import Logo from '../assets/luto-logo-white.png'

function Auth(p) {
    const user = p.user
    const setUser = p.setUser
    const showModal = p.showModal
    const setShowModal = p.setShowModal
    const setModalMessage = p.setModalMessage
    const setIsAuthenticated = p.setIsAuthenticated

    const [action, setAction] = useState('Sign In')
    const [isCredsCorrect, setIsCredsCorrect] = useState(true)
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const navigate = useNavigate()

    function createAccount() {
        axios.post(`http://localhost:8080/create-account`, { username: user.username, password })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                if (res.status === 202) {
                    setShowModal(true)
                    setModalMessage('Username already exists. Please choose a different username.')
                    setIsCredsCorrect(false)    
                } else if (res.status === 201) {
                    setUser({ username: '', userId: '', accountType: '' })
                    setPassword('')
                    setShowModal(true)
                    setModalMessage('Account Created!')
                    setIsCredsCorrect(true)
                    setAction("Sign In")
                }
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function signIn() {
        axios.get(`http://localhost:8080/sign-in`, { params: { username: user.username, password }, withCredentials: true })
            .then(res => {
                console.log('Status Code:' , res.status)
                console.log('Data:', res.data)
                
                if (res.status === 202) {
                    setShowModal(true)
                    setModalMessage('Incorrect username or password. Please try again.')
                    setIsCredsCorrect(false)
                } else if (res.status === 200) {
                    setUser({ 
                        username: res.data.payload.username, 
                        userId: res.data.payload.userId, 
                        accountType: res.data.payload.accountType,
                        profilePicture: res.data.payload.profilePicture,
                        bio: res.data.payload.bio
                    })
                    setIsAuthenticated(true)
                    navigate('/')
                }
            })
            .catch(error => {
                if (error.res) {
                    console.log('Error Status:', error.res.status)
                    console.log('Error Data:', error.res.data)
                } else if (error.request) {
                    console.log('Error Request:', error.request)
                } else {
                    console.log('Error Message:', error.message)
                }
            })
    }

    return (
        <div className="grid grid-cols-2 p-3 h-svh bg-gradient-to-b from-orange-500 to-orange-400 gap-3 overflow-hidden">
            <div className="flex flex-col items-center justify-center">
                <img className="" src={ Logo } alt=""/>
                <p className="mt-3 text-zinc-100 text-4xl overflow-hidden text-ellipsis line-clamp-1">Community with a Recipe.</p>
            </div>
            <AuthForm 
                createAccount={ createAccount } signIn={ signIn } action={ action } setAction={ setAction }
                showModal={ showModal } setShowModal={ setShowModal } setModalMessage={ setModalMessage }
                isCredsCorrect={ isCredsCorrect } setIsCredsCorrect={ setIsCredsCorrect } 
                user={ user } setUser={ setUser } password={ password } setPassword={ setPassword }
                passwordAgain={ passwordAgain } setPasswordAgain={ setPasswordAgain } 
            />
        </div>
    )
}

export default Auth