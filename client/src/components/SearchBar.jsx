import React from 'react'
import { Link } from 'react-router-dom'
import SearchIcon from '../assets/search-icon.png'

function SearchBar(p) {
    return (
        <div className={`${ p.currentTab==="Search" && "pr-6" } pr-3 fixed grid gap-3 w-full pointer-events-none`} style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="col-span-2"></div>
            <div className={`${ p.currentTab==="Search" && "bg-zinc-900" } flex flex-col col-span-11 rounded-3xl items-center justify-center`}>
                { p.currentTab==="Search" && <p className="text-zinc-400 text-4xl mt-7 py-1.5 overflow-hidden text-ellipsis line-clamp-1 mx-6">What are you looking up?</p> }
                <div className={`${ p.currentTab==="Search" && "my-10" } flex items-center justify-center shadow-sm shadow-zinc-950 rounded-3xl pointer-events-auto m-3 w-8/12 h-10 bg-zinc-700`}>
                    <div className="flex items-center justify-center ml-2 w-12 h-full"><img className="w-6" src={ SearchIcon } alt="" /></div>
                    <input className="w-full h-10 mx-2 rounded-3xl bg-transparent text-zinc-400 text-center" src={ SearchIcon } type="text" placeholder="Search"/>
                    <Link to="/search" className={`${ p.currentTab==="Search" ? "bg-zinc-700 pointer-events-none" : "bg-zinc-500 hover:bg-zinc-600" } flex flex-row items-center justify-center rounded-3xl mr-2 w-12 h-8 text-zinc-100`}>
                        <button onClick={ () => {  p.currentTab!=="Search" && p.setCurrentTab("Search") } }>
                            •••
                        </button>
                    </Link>
                </div>
            </div>
            <div className="col-span-2"></div>
        </div>
    )
}

export default SearchBar