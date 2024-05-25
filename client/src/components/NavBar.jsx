import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SearchBar from '../components/SearchBar'
import SidebarTab from '../components/SidebarTab'
import SidebarProfile from '../components/SidebarProfile'
import SidebarBuilder from '../components/SidebarBuilder'
import SidebarRecipe from '../components/SidebarRecipe'
import Logo from '../assets/luto-logo-gradient.png'
import ProfilePicture from '../assets/profile-picture.png'
import CreateIcon from '../assets/create-icon.png'
import SaveIcon from '../assets/saved-icon.png'

function NavBar(p) {
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const user = p.user
    const summary = p.summary
    const setSummary = p.setSummary
    const ingredients = p.ingredients
    const setIngredients = p.setIngredients
    const recipeContents = p.recipeContents

    function publishRecipe() {
        axios.post(`http://localhost:8080/publish-recipe`, recipeContents)
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)
            })
            .catch(err => {
                if (err.response) {
                    console.log('Error Status:', err.response.status)
                    console.log('Error Data:', err.response.data)
                } else if (err.request) {
                    console.log('Error Request:', err.request)
                } else {
                    console.log('Error Message:', err.message)
                }
            })
    }
    
    return (
        <div>
            <div className="fixed flex gap-3 flex-col w-full h-svh pointer-events-none">
                {/* on top of the navbar */}
                { (currentTab === "Home" || currentTab === "Search" || currentTab === "Settings" ) && <SearchBar currentTab={ currentTab } setCurrentTab={ p.setCurrentTab }/> }
                {/* navbar */}
                <div className="p-3 pb-0">
                    <div className="grid gap-3 w-full min-h-16 pointer-events-none" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                        {/* logo navbar side*/}
                        {
                            (currentTab === "Home" || currentTab === "Search" || currentTab === "Settings" ) &&
                            <Link to="/" className="pointer-events-auto rounded-3xl flex col-span-2 items-center justify-center bg-zinc-900 hover:bg-zinc-500">
                                <img className="px-4 w-48" src={ Logo } alt="" />
                            </Link>
                        }
                        {/* publish/create navbar */}
                        {
                            (currentTab === "Profile" || currentTab === "Builder" || currentTab === "Recipe") &&
                            <>
                                <Link to="/" className="col-span-2 items-center gap-4 bg-zinc-900 pointer-events-auto flex flex-row justify-center w-full h-full rounded-3xl overflow-hidden hover:bg-zinc-500">
                                    <img className="px-4 w-48 " src={ Logo } alt="" />
                                </Link>
                                <div className="col-span-2 flex items-center bg-orange-500 hover:bg-orange-400 pointer-events-auto w-full h-full rounded-3xl overflow-hidden">
                                    {
                                        currentTab === "Profile" &&
                                        <Link to="/recipe-builder" className="flex items-center p-4 gap-4 w-full h-full overflow-hidden">
                                            <p className="flex text-zinc-100 text-lg w-full font-semibold">Create</p>
                                            <img className="w-8" src={ CreateIcon } alt="" />
                                        </Link>
                                    }
                                    {
                                        currentTab === "Builder" &&
                                        <button className="flex items-center p-4 gap-4 w-full h-full overflow-hidden" onClick={ () => { publishRecipe() } }>
                                            <p className="flex text-zinc-100 text-lg w-full font-semibold">Publish</p>
                                            <img className="w-8" src={ CreateIcon } alt="" />
                                        </button>
                                    }
                                    {
                                        currentTab === "Recipe" &&
                                        <button className="flex items-center p-4 gap-4 w-full h-full overflow-hidden" onClick={ () => { publishRecipe() } }>
                                            <p className="flex text-zinc-100 text-lg w-full font-semibold">Save</p>
                                            <img className="w-8" src={ SaveIcon } alt="" />
                                        </button>
                                    }
                                </div>                               
                            </>
                        }
                        {/* logo navbar middle */}
                        {
                            (currentTab === "Home" || currentTab === "Search" || currentTab === "Settings" ) &&
                            <div className={`${ (currentTab!=="Home" && currentTab!=="Profile" && currentTab!=="Search") && "bg-zinc-900" } rounded-3xl flex items-center justify-center`} style={ { gridColumn: (currentTab === "Home" || currentTab === "Search" || currentTab === "Settings" ) ? "span 11" : "span 13" } }>
                                { 
                                    (currentTab !== "Home" && currentTab !== "Search" && currentTab !== "Profile") &&
                                    <Link to="/" className="fixed flex items-center pointer-events-auto left-1/2 transform -translate-x-1/2">
                                        <img className="px-4 w-48 " src={ Logo } alt="" />
                                    </Link>
                                }
                            </div>
                        }
                        {/* profile */}
                        {
                            (currentTab === "Home" || currentTab === "Search" || currentTab === "Settings" ) &&
                            <Link to={`/${ user.username }`} className="col-span-2 flex items-center justify-end rounded-3xl bg-zinc-900 pointer-events-auto hover:bg-zinc-500">
                                { currentTab!=="Profile" && <p className="text-zinc-100 text-end w-full ml-3 text-xl font-semibold overflow-hidden">{ user.username }</p> }
                                <img className="m-3 w-10" src={ ProfilePicture } alt="" />
                            </Link>
                        }
                    </div>
                </div>
                {/* content */}
                { (currentTab === "Home" || currentTab === "Search" || currentTab === "Settings" ) && <SidebarTab currentTab={ currentTab } setCurrentTab={ setCurrentTab } /> }
                { currentTab === "Profile" && <SidebarProfile user={ user } /> }
                { 
                    currentTab === "Builder" &&
                    (
                        <SidebarBuilder
                        ingredients={ ingredients || null} setIngredients={ setIngredients || null}
                        summary={ summary || null} setSummary={ setSummary || null}
                        user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                    />
                    )
                }
                { 
                    currentTab === "Recipe" &&
                    (
                        <SidebarRecipe
                        ingredients={ ingredients || null} setIngredients={ setIngredients || null}
                        summary={ summary || null} setSummary={ setSummary || null}
                        user={ user } currentTab={ currentTab } setCurrentTab={ setCurrentTab } 
                    />
                    )
                }
            </div>
        </div>
    )
}


export default NavBar