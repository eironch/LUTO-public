import React, { useState, useRef, useLayoutEffect } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import axios from 'axios'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Search from './pages/Search'
import Recipe from './pages/Recipe'
import Create from './pages/Create'
import Modal from './components/Modal'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [isLoading, setIsLoading] = useState(true) 
  const [user, setUser] = useState({ username: '', userId: ''})
  const [modalMessage, setModalMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [currentTab, setCurrentTab] = useState('Home')
  const [filters, setFilters] = useState([])
  const filtersRef = useRef(filters)
  
  async function postApproveRecipe(userId, recipeId) {
    return await axios.post('http://localhost:8080/approve-recipe', { userId, recipeId })
      .then(response => {
        console.log('Status Code:' , response.status)
        console.log('Data:', response.data)

        return { isApproved: response.data.payload.isApproved, approvalCount: response.data.payload.approvalCount.approvalCount }
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
              <Route path="/home" element={ 
                  <Home
                    setIsAuthenticated={ setIsAuthenticated } user={ user } 
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                    filters={ filters } setFilters={ setFilters } filtersRef={ filtersRef }
                    postApproveRecipe={ postApproveRecipe }
                  /> 
                }
              />
              <Route path="/:authorName" element={ 
                  <Profile 
                    user={ user } 
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                    postApproveRecipe={ postApproveRecipe } 
                  /> 
                }
              />
              <Route path="/settings" element={ 
                  <Settings 
                    user={ user } 
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                  /> 
                } 
              />
              <Route path="/search" element={ 
                  <Search 
                    user={ user }
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab }
                    filters={ filters } setFilters={ setFilters } filtersRef={ filtersRef }
                  /> 
                } 
              />
              <Route path="/create" element={ 
                  <Create 
                    user={ user } 
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                  /> 
                } 
              />
              <Route path="/recipe/:recipeId" element={ 
                  <Recipe 
                    user={ user } 
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                  /> 
                } 
              />
              <Route path="/" element={ 
                  <Navigate to="/home" />
                } 
              />
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
