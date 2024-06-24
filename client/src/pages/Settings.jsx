import React, { useLayoutEffect } from 'react'
import NavBar from '../components/NavBar'

function Settings(p) {
    const user = p.user
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab

    useLayoutEffect(() => {
        setCurrentTab('Settings')
    }, [])

    if (currentTab !== 'Settings') {
        return
    }

    return (
        <div>
            <NavBar 
                user={ p.user } currentTab={ p.currentTab }
                setCurrentTab={ p.setCurrentTab }
            />
            <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-950">
                {/* space for top navbar */}
                <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="col-span-2"></div>
                    <div className="col-span-11 h-16 rounded-3xl bg-zinc-900"></div>
                    <div className="col-span-2"></div>     
                </div>
                {/* content */}
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="col-span-2"></div>
                    <div className="flex flex-col p-9 bg-zinc-900 rounded-3xl text-zinc-100" style={ { gridColumn: "span 13" } }>
                        <p className="text-3xl font-bold mb-6">Account Settings</p>
                        <p className="text-lg mb-6">Account Preferences</p>
                        <div className="grid grid-cols-2 mb-6">
                            <div>
                                <p className="text-xl">Email Address</p>
                                <p className="text-lg text-zinc-400">sampleemail@gmail.com</p>
                            </div>
                            <div className="flex flex-row items-center justify-end">
                                <button className="w-44 h-10 rounded-3xl bg-zinc-700 hover:bg-zinc-500">
                                    Change
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 mb-6">
                            <div>
                                <p className="text-xl">Change Password</p>
                                <p className="text-lg text-zinc-400">Pasword must be at least 8 characters long</p>
                            </div>
                            <div className="flex flex-row items-center justify-end">
                                <button className="w-44 h-10 rounded-3xl bg-zinc-700 hover:bg-zinc-500">
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings