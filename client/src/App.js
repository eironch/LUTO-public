import React, { useState, useLayoutEffect } from 'react'
import axios from 'axios'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Modal from './components/Modal'
import NavBar from './components/NavBar'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [isLoading, setIsLoading] = useState(true) 
  const [username, setUsername] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentTab, setCurrentTab] = useState('Home')

  useLayoutEffect(() => {
    axios.get(`http://localhost:8080/check-auth`, { withCredentials: true })
      .then(response => {
          console.log('Status Code:' , response.status)
          console.log('Data:', response.data)
         
          setIsLoading(false)
          setUsername(response.data.data)
          setIsAuthenticated(response.data.isAuthenticated)
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

          setIsLoading(false)
          setIsAuthenticated(false)
      })
  }, [])

  return (
    <div>
      {
        isLoading? 
        <></>
        :
        isAuthenticated ?
        <>
          <NavBar username={ username } currentTab={ currentTab } setCurrentTab={ setCurrentTab } />
          { currentTab==="Home" && <Home setIsAuthenticated={ setIsAuthenticated } username={ username } currentTab={ currentTab } /> }
          { currentTab==="Profile" && <Profile /> }
          { currentTab==="Settings" && <Settings /> }
        </>
        :  
        <Auth 
          isAuthenticated={ isAuthenticated } setIsAuthenticated={ setIsAuthenticated } username={ username } setUsername={ setUsername }
          showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage }     
        />
      }
      <Modal showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage } />
    </div>
  )
}

export default App
