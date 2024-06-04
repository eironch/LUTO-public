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
  const [user, setUser] = useState({ username: '', userId: ''})
  const [modalMessage, setModalMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentTab, setCurrentTab] = useState('Home')
  
  function postApproveRecipe(userId, recipeId) {
    axios.post('http://localhost:8080/approve-recipe', { userId, recipeId })
      .then(response => {
        console.log('Status Code:' , response.status)
        console.log('Data:', response.data)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  useLayoutEffect(() => {
    axios.get(`http://localhost:8080/check-auth`, { withCredentials: true })
      .then(response => {
          console.log('Status Code:' , response.status)
          console.log('Data:', response.data)

          setIsLoading(false)
          setUser({ username: response.data.payload.username, userId: response.data.payload.userId })
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
    <>
      {
        isLoading? 
        <></>
        :
        isAuthenticated ?
        <>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={ <Home setIsAuthenticated={ setIsAuthenticated } user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } postApproveRecipe={ postApproveRecipe } /> } />
              <Route path="/:authorName" element={ <Profile user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } postApproveRecipe={ postApproveRecipe } />
              <Route path="/settings" element={ <Settings user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
              <Route path="/search" element={ <Search user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
              <Route path="/recipe-builder" element={ <RecipeBuilder user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
              <Route path="/recipe/:recipeId" element={ <Recipe user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> } />
            </Routes>
          </BrowserRouter>
        </>
        :
        <Auth 
          isAuthenticated={ isAuthenticated } setIsAuthenticated={ setIsAuthenticated } user={ user } setUser={ setUser }
          showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage }     
        />
      }
      <Modal showModal={ showModal } setShowModal={ setShowModal } modalMessage={ modalMessage } setModalMessage={ setModalMessage } />
    </>
  )
}

export default App
