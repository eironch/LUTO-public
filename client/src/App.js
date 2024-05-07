import React, { useState, useLayoutEffect } from 'react'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Modal from './components/Modal'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState()
  const [username, setUsername] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      { 
        isLoggedIn ? 
        <Home setIsLoggedIn={ setIsLoggedIn } username={ username } />
        :  
        <Auth 
          isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } username={ username } setUsername={ setUsername }
          showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage }     
        /> 
      }
           {/* <Home setIsLoggedIn={ setIsLoggedIn } /> */}
      <Modal showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage } />
    </div>
  )
}

export default App
