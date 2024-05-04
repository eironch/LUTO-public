import React, { useState, useLayoutEffect } from 'react'
import Auth from './pages/Auth'
import Home from './pages/Home'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState()

  useLayoutEffect(() => {

  })

  return (
    <div>
      { 
        isLoggedIn ? 
        <Home setIsLoggedIn={ setIsLoggedIn } />
        :  
        <Auth isLoggedIn={ isLoggedIn } setIsLoggedIn={ setIsLoggedIn } /> 
      }
    </div>
  );
}

export default App;
