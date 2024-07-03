import React from 'react'
import { useNavigate } from 'react-router-dom'

import SearchIcon from '../assets/search-icon.png'
import RemoveIcon from '../assets/remove-icon.png'

function SearchBar(p) {
    const searchQuery = p.searchQuery
    const setSearchQuery = p.setSearchQuery

    const navigate = useNavigate()

    function handleEnterKey(e) {
        if (e.key === 'Enter' && searchQuery !== "") {
            navigate('/search')
        }
    }

    return (
        <div className="absolute grid gap-3 p-3 w-full overflow-hidden pointer-events-none" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
            <div className="col-span-2"></div>
            <div className="flex flex-col col-span-11 rounded-3xl items-center justify-center pointer-events-none">
                {/* search bar */}
                <div className="relative flex m-3 w-8/12 h-10 items-center justify-center shadow-md shadow-zinc-900 rounded-3xl bg-zinc-600">
                    <div className="absolute flex ml-6 left-0 right-0 items-start justify-left pointer-events-none">
                        <img className="w-6" src={ SearchIcon } alt="" />
                    </div>
                    <input 
                        className="w-full px-28 h-10 rounded-3xl bg-transparent text-zinc-100 placeholder:text-zinc-400 text-center pointer-events-auto" 
                        value={ searchQuery } onChange={ (e) => setSearchQuery(e.target.value) }
                        onKeyDown={ e => handleEnterKey(e) }
                        type="text" placeholder="Search LUTO"
                    />
                    <div className="absolute flex flex-row mr-2 right-0 items-last justify-right pointer-events-none">
                        <button
                            className="flex justify-center items-center w-12 h-8 rounded-3xl text-zinc-100 hover:bg-zinc-500 pointer-events-auto" 
                            onClick={ () => searchQuery !== "" && navigate('/search') }
                        >
                            ➤
                        </button>
                    </div>
                    {
                        searchQuery &&
                        <div className="absolute flex mr-28 pr-2 w-full justify-end pointer-events-none">
                            <button className="p-2 rounded-3xl hover:bg-zinc-500 pointer-events-auto" onClick={ () => setSearchQuery('') }>
                                <img className="w-4" src={ RemoveIcon } alt=""/>
                            </button>
                        </div>
                    }
                </div>
            </div>
            <div className="col-span-2"></div>
        </div>
    )
}

export default SearchBar