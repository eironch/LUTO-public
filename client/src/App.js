import React, { useState, useLayoutEffect } from 'react'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Modal from './components/Modal'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState()
  const [modalMessage, setModalMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      { 
        isLoggedIn ? 
        <Home setIsLoggedIn={ setIsLoggedIn } />
        :  
        <Auth 
          showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage } 
          isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } 
        /> 
      }
      <Modal showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage } />
    </div>
  )
}

export default App
