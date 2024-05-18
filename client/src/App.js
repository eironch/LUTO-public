import React, { useState, useLayoutEffect } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Search from './pages/Search'
import Recipe from './pages/Recipe'
import RecipeBuilder from './pages/RecipeBuilder'
import Modal from './components/Modal'

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
          setUsername(response.data.payload.username || "")
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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={ <Home setIsAuthenticated={ setIsAuthenticated } username={ username } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
              <Route path={`/${ username }`} element={ <Profile currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
              <Route path="/settings" element={ <Settings username={ username } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
              <Route path="/search" element={ <Search username={ username } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
              <Route path="/recipe" element={ <Recipe username={ username } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
              <Route path="/recipe-builder" element={ <RecipeBuilder username={ username } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
            </Routes>
          </BrowserRouter>
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
