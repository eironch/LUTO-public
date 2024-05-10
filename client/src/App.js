import React, { useState, useLayoutEffect } from 'react'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Modal from './components/Modal'
import Profile from './pages/Profile'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState()
  const [username, setUsername] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      
        <Profile />
      
    </div>
  )
}

export default App
