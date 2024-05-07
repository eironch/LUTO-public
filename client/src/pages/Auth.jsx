import React, { useState } from 'react'
import axios from 'axios'
import AuthForm from '../components/AuthForm'
import Logo from '../assets/luto-logo-white.png'

function Auth(p) {
    const [action, setAction] = useState('Sign In')
    const [isCredsCorrect, setIsCredsCorrect] = useState(true)
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')

    function createAccount() {
        axios.post(`http://localhost:8080/create-account`, { username: p.username, password } )
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)
                
                if (response.status === 202) {
                    p.setShowModal(true)
                    p.setModalMessage('Username already exists. Please choose a different username.')
                    setIsCredsCorrect(false)    
                } else if (response.status === 201) {
                    p.setUsername('')
                    setPassword('')
                    p.setShowModal(true)
                    p.setModalMessage('Account Created!')
                    setIsCredsCorrect(true)
                    setAction("Sign In")
                }
            })
            .catch(error => {
                if (error.response) {
                    console.log('Error Status:', error.response.status)
                    console.log('Error Data:', error.response.data)
                } else if (error.request) {
                    console.log('Error Request:', error.request)
                } else {
                    console.log('Error Message:', error.message)
                }
            })
    }

    function signIn() {
        axios.post(`http://localhost:8080/sign-in`, { username: p.username, password })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)
                
                if (response.status === 202) {
                    p.setShowModal(true)
                    p.setModalMessage('Incorrect username or password. Please try again.')
                    setIsCredsCorrect(false)
                } else if (response.status === 200) {
                    p.setIsLoggedIn(true)
                }
            })
            .catch(error => {
                if (error.response) {
                    console.log('Error Status:', error.response.status)
                    console.log('Error Data:', error.response.data)
                } else if (error.request) {
                    console.log('Error Request:', error.request)
                } else {
                    console.log('Error Message:', error.message)
                }
            })
    }

    return (
        <div className="grid grid-cols-2 p-3 h-svh bg-gradient-to-b from-orange-500 to-orange-400 gap-3">
            <div className="flex flex-col items-center justify-center">
                <img className="" src={ Logo } alt=""/>
                <p className="mt-3 text-zinc-50 text-4xl">Community with a Recipe.</p>
            </div>
            <AuthForm 
                createAccount={ createAccount } signIn={ signIn } action={ action } setAction={ setAction }
                showModal={ p.showModal } setShowModal={ p.setShowModal } setModalMessage={ p.setModalMessage }
                isCredsCorrect={ isCredsCorrect } setIsCredsCorrect={ setIsCredsCorrect } 
                username={ p.username } setUsername={ p.setUsername } password={ password } setPassword={ setPassword }
                passwordAgain={ passwordAgain } setPasswordAgain={ setPasswordAgain } 
            />
        </div>
    )
}

export default Auth