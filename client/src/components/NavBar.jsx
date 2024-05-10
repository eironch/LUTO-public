import React from 'react'
import SearchBar from '../components/SearchBar'
import TabSidebar from '../components/TabSidebar'
import ProfileSidebar from '../components/ProfileSidebar'
import Logo from '../assets/luto-logo-gradient.png'
import Back from '../assets/back-icon.png'
import ProfilePicture from '../assets/profile-picture.png'

function NavBar(p) {
    return (
        <div className={`${ p.currentTab==="Home" && "pr-0" } fixed flex flex-col gap-3 p-3 w-full h-svh pointer-events-none`}>
            {/* above the navbar */}
            { p.currentTab==="Home" && <SearchBar /> }
            {/* above the navbar */}
            {/* navbar */}
            <div className="grid gap-3 w-full h-16 pointer-events-none" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                {
                    p.currentTab==="Home" &&
                    <div className="rounded-3xl flex col-span-2 items-center justify-center bg-zinc-900">
                        <img className="m-3 px-4 w-48" src={ Logo } alt="" />   
                    </div>
                }
                {
                    p.currentTab==="Profile" &&
                    <button className={`${ p.currentTab==="Home" && "bg-zinc-700 shadow-sm shadow-zinc-950" } col-span-2 bg-zinc-900 pointer-events-auto flex flex-row w-full rounded-3xl hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`} onClick={() => { p.setCurrentTab("Home") }}>
                        <div className="flex items-center overflow-hidden m-4 gap-4 w-full">
                            <img className="w-8" src={ Back } alt="" />
                            <p className="text-zinc-200 text-lg">Back</p>
                        </div>
                    </button>
                }
                <div className={`${ p.currentTab!=="Home"  && "bg-zinc-900" } rounded-3xl flex items-center justify-center`} style={ { gridColumn: p.currentTab==="Home" ? "span 11" : "span 13" } }>
                    { p.currentTab!=="Home" && <img className="p-3 w-48 fixed left-1/2 transform -translate-x-1/2" src={ Logo } alt="" /> }
                </div>
                {
                    p.currentTab!=="Profile" &&
                    <button className="col-span-2 flex items-center justify-end rounded-3xl bg-zinc-900 pointer-events-auto hover:bg-zinc-500" onClick={ () => { p.setCurrentTab("Profile") } }>
                        { p.currentTab!=="Profile" && <p className="text-zinc-200 text-end w-full ml-3 text-xl overflow-hidden">{ p.username }</p> }
                        <img className="m-3 w-10" src={ ProfilePicture } alt="" />
                    </button>
                }
            </div>
            {/* navbar */}
            {/* content */}
            {
                p.currentTab==="Profile" ? 
                <ProfileSidebar />
                :
                <TabSidebar currentTab={ p.currentTab } setCurrentTab={ p.setCurrentTab }/>
            }
            {/* content */}
        </div>
    )
}

export default NavBar