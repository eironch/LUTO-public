import React from 'react'
import SearchIcon from '../assets/search-icon.png'

function SearchBar(p) {
    return (
        <div className="fixed pr-3 grid gap-3 w-full h-16 pointer-events-none" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
            <div className="col-span-2"></div>
            <div className="col-span-11 rounded-3xl flex items-center justify-center">
                <div className="flex items-center justify-center shadow-sm shadow-zinc-950 rounded-3xl pointer-events-auto m-3 w-8/12 h-10 bg-zinc-700">
                    <div className="mx-4 w-7"><img className="w-6" src={ SearchIcon } alt="" /></div>
                    <input className="w-full h-10 rounded-3xl bg-transparent text-zinc-400 text-center" src={ SearchIcon } type="text" placeholder="Search"/>
                    <div className="flex flex-row mx-4 w-7 text-zinc-400">•••</div>
                </div>
            </div>
            <div className="col-span-2"></div>
        </div>
    )
}

export default SearchBar