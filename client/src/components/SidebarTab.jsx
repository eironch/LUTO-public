import React, { useState, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'

import HomeIcon from '../assets/home-icon.png'
import PopularIcon from '../assets/popular-icon.png'
import SavedIcon from '../assets/saved-icon.png'
import CreateIcon from '../assets/create-icon.png'
import SettingsIcon from '../assets/settings-icon.png'
import FilterIcon from '../assets/filter-icon.png'
import SearchIcon from '../assets/search-icon.png'

function SidebarTab(p) {
    const currentTab = p.currentTab
    const filters = p.filters
    const setFilters = p.setFilters

    const [searchValue, setSearchValue] = useState('')
    const [tagChoices, setTagChoices] = useState([])
    const systemTags = ['Vegetarian',
        'Vegan',
        'Pescatarian',
        'Flexitarian',
        'Paleo',
        'Keto',
        'Low-Carb',
        'Low-Fat',
        'High-Protein',
        'Gluten-Free',
        'Dairy-Free',
        'Nut-Free',
        'Soy-Free',
        'Sugar-Free',
        'Low-Sodium',
        'Whole30',
    ]

    function addTag(e) {
        const index = e.target.id
        const tag = tagChoices[index]

        if (!filters.includes(tag)) {
            setFilters([...filters, tag])
        }
    }

    function removeTag(e) {
        const index = e.target.id
        const tag = filters[index]

        setFilters(filters.filter(recipeTag => recipeTag !== tag))
    }

    const handleTagSearch = debounce(input => {
        if (!input) {
            return handlePopularTags()
        }
        
        setTagChoices(systemTags.filter(tag => 
            new RegExp(`.*${ input }.*`, 'i').test(tag)
        ))
    }, 300)

    function handlePopularTags() {
        setTagChoices(systemTags)
    }

    useLayoutEffect(() => {
        handleTagSearch(searchValue)
    }, [searchValue])

    useLayoutEffect(() => {
        handlePopularTags()
    }, [])

    return (
        <div className="p-3 pt-0 grid w-full gap-3 h-full overflow-hidden" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="col-span-2 rounded-3xl bg-zinc-900 pointer-events-auto">
                <div className="flex items-center flex-col gap-3 m-3">
                    <Link to="/home" className={`${ currentTab==="Home" && "bg-zinc-700 shadow-md shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ HomeIcon } alt="" />
                        <p className="text-zinc-100 text-lg font-semibold">Home</p>
                    </Link>
                    <Link to="/popular" className={`${ currentTab==="Popular" && "bg-zinc-700 shadow-md shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ PopularIcon } alt="" />
                        <p className="text-zinc-100 text-lg font-semibold">Popular</p>
                    </Link>
                    <Link to="/saved" className={`${ currentTab==="Saved" && "bg-zinc-700 shadow-md shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ SavedIcon } alt="" />
                        <p className="text-zinc-100 text-lg font-semibold">Saved</p>
                    </Link>
                    <Link to="/create" className={`${ currentTab==="Create" && "bg-zinc-700 shadow-md shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ CreateIcon } alt="" />
                        <p className="text-zinc-100 text-lg font-semibold">Create</p>
                    </Link>
                    <Link to="/settings" className={`${ currentTab==="Settings" && "bg-zinc-700 shadow-md shadow-zinc-950" } flex flex-row items-center gap-4 p-4 overflow-hidden w-full rounded-3xl hover:bg-zinc-500 hover:shadow-md hover:shadow-zinc-950`}>
                        <img className="w-8" src={ SettingsIcon } alt="" />
                        <p className="text-zinc-100 text-lg font-semibold">Settings</p>
                    </Link>
                </div>
            </div>
            <div className="col-span-11"></div>
            {/* filters */}
            {
                (currentTab === "Home" || currentTab === "Search" || currentTab === "Saved") &&
                <div className="bg-zinc-900 flex flex-col text-zinc-100 rounded-3xl col-span-2 overflow-hidden pointer-events-auto">
                    <div className="flex p-6 gap-3 shadow-md shadow-zinc-950 flex-row items-center">
                        <img  className="w-8" src={ FilterIcon } alt="" />
                        <p className="text-2xl font-bold">
                            Filter
                        </p>
                    </div>
                    <div className="flex flex-col pl-6 pr-3 pt-3 pb-6 gap-3 scrollable-div overflow-y-scroll overflow-x-hidden">
                        {/* selected tags */}
                        <div className="font-semibold gap-3">
                            {
                                filters &&
                                filters.map((tag, index) => 
                                    <button className="m-1 px-3 py-1 w-fit bg-zinc-700 rounded-3xl hover:bg-zinc-500" key={ index } id={ index } onClick={ e => { removeTag(e) } }>
                                        { tag }
                                    </button>
                                )
                            }
                        </div>
                        {/* search input */}
                        <div className="relative flex w-full items-center justify-center shadow-md shadow-zinc-950 rounded-3xl bg-zinc-700">
                            <div className="absolute flex ml-4 left-0 right-0 items-start justify-left pointer-events-none">
                                <img className="w-6" src={ SearchIcon } alt="" />
                            </div>
                            <input className="w-full px-14 h-10 rounded-3xl bg-transparent text-zinc-100 text-start"
                                value={ searchValue } onChange={ e => setSearchValue(e.target.value) } type="text" placeholder="Search Tags"
                            />
                        </div>
                        {/* tags */}
                        <div className="font-semibold gap-3">
                            {
                                filters &&
                                tagChoices.map((tag, index) => {
                                    const isAdded = filters.find(recipeTag => recipeTag === tag)

                                    return (
                                        <button className={`${ isAdded ? "bg-zinc-800" : "bg-zinc-700 hover:bg-zinc-500" } m-1 px-3 py-1 w-fit rounded-3xl`} 
                                            disabled={ isAdded } key={ index } id={ index } onClick={ e => { addTag(e) } }
                                        >
                                            { tag }
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>  
            }      
        </div>
    )
}

export default SidebarTab