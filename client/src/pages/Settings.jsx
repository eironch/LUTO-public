import React from 'react'

function Settings(p) {
    return (
        <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-950">
            <div className="flex flex-row w-full gap-3 h-16">
                <div className="w-80"></div>
                <div className="h-16 w-full rounded-3xl"></div>
                <div className="w-80"></div>     
            </div>
            <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' } }>
                <div className="col-span-2"></div>
                <div className="flex flex-col p-9 bg-zinc-900 rounded-3xl text-zinc-200" style={ { gridColumn: "span 13" } }>
                    <p className="text-3xl font-bold mb-6">Account Settings</p>
                    <p className="text-lg mb-6">Account Preferences</p>
                    <div className="grid grid-cols-2 mb-6">
                        <div>
                            <p className="text-xl">Email Address</p>
                            <p className="text-lg text-zinc-400">sampleemail@gmail.com</p>
                        </div>
                        <div className="flex flex-row items-center justify-end">
                            <button className="w-44 h-10 border rounded-3xl border-zinc-200 hover:bg-zinc-600">
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
                            <button className="w-44 h-10 border rounded-3xl border-zinc-200 hover:bg-zinc-600">
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings