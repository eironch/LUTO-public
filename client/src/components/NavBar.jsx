import React from 'react'
import { Link } from 'react-router-dom'
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
            { (p.currentTab==="Home" || p.currentTab==="Search") && <SearchBar currentTab={ p.currentTab } setCurrentTab={ p.setCurrentTab }/> }
            {/* above the navbar */}
            {/* navbar */}
            <div className="grid gap-3 w-full min-h-16 pointer-events-none" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                {
                    (p.currentTab==="Home" || p.currentTab==="Search") &&
                    <div className="rounded-3xl flex col-span-2 items-center justify-center bg-zinc-900">
                        <Link to="/" className="mx-3 px-3 pointer-events-auto">
                            <img className="w-40" src={ Logo } alt="" />
                        </Link>
                    </div>
                }
                {
                    p.currentTab==="Profile" &&
                    <Link to="/" className={`${ p.currentTab==="Home" && "bg-zinc-700 shadow-sm shadow-zinc-950" } col-span-2 items-center px-4 gap-4 bg-zinc-900 pointer-events-auto flex flex-row w-full h-full rounded-3xl overflow-hidden hover:bg-zinc-500 hover:shadow-sm hover:shadow-zinc-950`}>
                        <img className="w-8" src={ Back } alt="" />
                        <p className="text-zinc-100 text-lg ">Back</p>
                    </Link>
                }
                <div className={`${ p.currentTab!=="Home"  && "bg-zinc-900" } rounded-3xl flex items-center justify-center`} style={ { gridColumn: (p.currentTab==="Home" || p.currentTab==="Search") ? "span 11" : "span 13" } }>
                    { 
                        (p.currentTab!=="Home" && p.currentTab!=="Search") &&
                        <Link to="/" className="fixed flex items-center pointer-events-auto left-1/2 transform -translate-x-1/2">
                            <img className="px-4 w-48 " src={ Logo } alt="" />
                        </Link>
                    }
                </div>
                {
                    p.currentTab!=="Profile" &&
                    <Link to={`/${ p.username }`} className="col-span-2 flex items-center justify-end rounded-3xl bg-zinc-900 pointer-events-auto hover:bg-zinc-500">
                        { p.currentTab!=="Profile" && <p className="text-zinc-100 text-end w-full ml-3 text-xl overflow-hidden">{ p.username }</p> }
                        <img className="m-3 w-10" src={ ProfilePicture } alt="" />
                    </Link>
                }
            </div>
            {/* navbar */}
            {/* content */}
            {
                p.currentTab!=="Profile" ? 
                <TabSidebar currentTab={ p.currentTab } setCurrentTab={ p.setCurrentTab } />
                :
                <ProfileSidebar />
            }
            {/* content */}
        </div>
        {p.currentTab !== "Profile" && (
          <button
            className="col-span-2 flex items-center justify-end rounded-3xl bg-zinc-900 pointer-events-auto hover:bg-zinc-500"
            onClick={() => {
              p.setCurrentTab("Profile");
            }}
          >
            {p.currentTab !== "Profile" && (
              <p className="text-zinc-200 text-end w-full ml-3 text-xl overflow-hidden">
                {p.username}
              </p>
            )}
            <img className="m-3 w-10" src={ProfilePicture} alt="" />
          </button>
        )}
      </div>
      {/* navbar */}
      {/* content */}
      {p.currentTab === "Profile" ? (
        <ProfileSidebar />
      ) : (
        <TabSidebar currentTab={p.currentTab} setCurrentTab={p.setCurrentTab} />
      )}
      {/* content */}
    </div>
  );
}

export default NavBar;
