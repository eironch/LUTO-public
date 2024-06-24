import React, { useState, useLayoutEffect } from 'react'

import NavBar from '../components/NavBar'

function Saved(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab

    useLayoutEffect(() => {
        setCurrentTab('Saved')
    }, [])
    
    if (currentTab !== 'Saved') {
        return
    }

    return (
        <div className="scrollable-div overflow-y-scroll">
            <NavBar 
                user={ user } 
                currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
            />
        </div>
    )
}

export default Saved