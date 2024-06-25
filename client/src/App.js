import React, { useState, useRef, useLayoutEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { format, getYear } from 'date-fns'

import Auth from './pages/Auth'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Search from './pages/Search'
import Recipe from './pages/Recipe'
import Create from './pages/Create'
import Saved from './pages/Saved'

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
  const [searchQuery, setSearchQuery] = useState("")

  async function handleGiveRecipePoint(userId, recipeId, pointStatus) {
    return await axios.post('http://localhost:8080/give-point', { userId, recipeId, pointStatus })
      .then(res => {
        console.log('Status Code:', res.status)
        console.log('Data:', res.data)
        
        return { recipePointStatus: res.data.payload.pointStatus, points: res.data.payload.points.points }
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleFlagRecipe(userId, recipeId) {
    axios.post('http://localhost:8080/flag-recipe', { userId, recipeId })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleRemoveRecipe(removerUserId, recipeId) {
    axios.post('http://localhost:8080/remove-recipe', { removerUserId, recipeId })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  function handleAllowRecipe(recipeId) {
    axios.post('http://localhost:8080/allow-recipe', { recipeId })
      .then(res => {
        console.log('Status Code:' , res.status)
        console.log('Data:', res.data)
      })
      .catch(err => {
        console.log('Error Status:', err.response.status)
        console.log('Error Data:', err.response.data)
      })
  }

  useLayoutEffect(() => {
    axios.get(`http://localhost:8080/check-auth`, { withCredentials: true })
      .then(res => {
          console.log('Status Code:' , res.status)
          console.log('Data:', res.data)
          
          setIsLoading(false)
          setUser({ 
            username: res.data.payload.username, 
            userId: res.data.payload.userId, 
            accountType: res.data.payload.accountType 
          })
          setIsAuthenticated(res.data.isAuthenticated)
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

          setIsLoading(false)
          setIsAuthenticated(false)
      })
  }, [])

  function calculateDiffInTime(dateNow, pastDate, unitsOfTime) {
    const diffInMilliseconds = dateNow - pastDate
    const diffInTime = Math.floor(diffInMilliseconds / (1000 * unitsOfTime))
    
    return diffInTime
  }

  function formatDate(dateCreated) {
    const dateNow = new Date()
    
    if (getYear(dateCreated) > getYear(dateNow)) {
      return format(dateCreated, 'PP')
    }
    
    const diffInDays = calculateDiffInTime(dateNow, dateCreated, 60 * 60 * 24)
    if (diffInDays >= 7) {
      return format(dateCreated, 'MMMM d')
    }

    if (diffInDays > 0) {
      return `${ diffInDays } ${ diffInDays === 1 ? 'day ago' : 'days ago' }`
    }
    
    const diffInHours = calculateDiffInTime(dateNow, dateCreated, 60 * 60)
    if (diffInHours > 0) {
      return `${ diffInHours } ${ diffInHours === 1 ? 'hour ago' : 'hours ago' }`
    }

    const diffInMinutes = calculateDiffInTime(dateNow, dateCreated, 60)
    if (diffInMinutes > 0) {
      return `${ diffInMinutes } ${ diffInMinutes === 1 ? 'minute ago' : 'minutes ago' }`
    }

    const diffInSeconds = calculateDiffInTime(dateNow, dateCreated)
    if (diffInSeconds > 0) {
      return `${ diffInSeconds } ${ diffInSeconds === 1 ? 'second ago' : 'seconds ago' }`
    }

    return 'just now'
}

  return (
    <>
      {
        isLoading? 
        <></>
        :
        isAuthenticated ?
        <>
            <Routes>
              <Route path="/home" element={ 
                  <Home
                    setIsAuthenticated={ setIsAuthenticated } user={ user } 
                    currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                    filters={ filters } setFilters={ setFilters } filtersRef={ filtersRef }
                    handleGiveRecipePoint={ handleGiveRecipePoint } formatDate={ formatDate }
                    searchQuery={ searchQuery } setSearchQuery={ setSearchQuery }
                    handleFlagRecipe={ handleFlagRecipe } handleRemoveRecipe={ handleRemoveRecipe } 
                    handleAllowRecipe={ handleAllowRecipe } 
                  />
                }
              />
              <Route path="/:authorName" element={ 
                  <Profile 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } handleGiveRecipePoint={ handleGiveRecipePoint } 
                    formatDate={ formatDate } searchQuery={ searchQuery } 
                    setSearchQuery={ setSearchQuery } handleRemoveRecipe={ handleRemoveRecipe } 
                    handleAllowRecipe={ handleAllowRecipe } handleFlagRecipe={ handleFlagRecipe }
                  />
                }
              />
              <Route path="/settings" element={ 
                  <Settings 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab }
                  />
                } 
              />
              <Route path="/search" element={ 
                  <Search 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } filters={ filters }
                    setFilters={ setFilters } formatDate={ formatDate }
                    handleGiveRecipePoint={ handleGiveRecipePoint } handleFlagRecipe={ handleFlagRecipe }
                    searchQuery={ searchQuery } setSearchQuery={ setSearchQuery }
                    handleRemoveRecipe={ handleRemoveRecipe } handleAllowRecipe={ handleAllowRecipe }
                  /> 
                } 
              />
              <Route path="/create" element={ 
                  <Create
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab }
                  />
                } 
              />
              <Route path="/recipe/:recipeId" element={ 
                  <Recipe 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab } formatDate={ formatDate }
                    handleGiveRecipePoint={ handleGiveRecipePoint }
                  /> 
                } 
              />
              <Route path="/saved" element={ 
                  <Saved 
                    user={ user } currentTab={ currentTab } 
                    setCurrentTab={ setCurrentTab }
                  /> 
                } 
              />
              <Route path="/" element={ 
                  <Navigate to="/home" />
                } 
              />
            </Routes>
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
