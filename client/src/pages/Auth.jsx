import React, { useState } from 'react'
import axios from 'axios'
import AuthForm from '../components/AuthForm'
import Modal from '../components/Modal'
import Logo from "../assets/luto_logo_white.png" 

function Auth(p) {
    const [action, setAction] = useState('Sign In')
    const [isCredsCorrect, setIsCredsCorrect] = useState(true)
    const [modalMessage, setModalMessage] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    function createAccount() {
        axios.post(`http://localhost:8080/create-account`, { email, username, password } )
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)
                
                if (response.status === 202) {
                    setShowModal(true)
                    setModalMessage('Username already exists. Please choose a different username.')
                    setIsCredsCorrect(false)    
                } else if (response.status === 201) {
                    setUsername('')
                    setPassword('')
                    setShowModal(true)
                    setModalMessage('Account Created!')
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
        axios.post(`http://localhost:8080/sign-in`, { username, password })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)
                
                if (response.status === 202) {
                    setShowModal(true)
                    setModalMessage('Incorrect username or password. Please try again.')
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
        <div>
            <div className="grid grid-cols-2 p-2 h-svh bg-gradient-to-b from-orange-500 to-orange-400 gap-2">
                <div className="flex flex-col items-center justify-center">
                    <img className="" src={Logo} alt=""/>
                    <p className="mt-2 text-gray-50 text-4xl">Community with a Recipe.</p>
                </div>
                <AuthForm 
                    createAccount={ createAccount } signIn={ signIn } action={ action } setAction={ setAction }
                    showModal={ showModal } setShowModal={ setShowModal } setModalMessage={ setModalMessage }
                    isCredsCorrect={ isCredsCorrect } setIsCredsCorrect={ setIsCredsCorrect } 
                    email={ email } setEmail={ setEmail } username={ username } setUsername={ setUsername } password={ password } setPassword={ setPassword }
                />
            </div>
            <Modal showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage } />
        </div>
     
    )
}

export default Auth