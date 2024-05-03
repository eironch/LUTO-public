import React, { useState } from 'react';

function AuthForm(props) {
    const[action,setAction] = useState('Create Account')

    return (
        <div className="flex flex-col bg-zinc-900 rounded-3xl justify-center py-5">
            <div className="flex flex-col items-center">
                <h1 className="text-gray-50 text-5xl font-bold">{action}</h1>
            </div>

            <div className="flex flex-col mt-10 items-center">
                {
                    action === 'Sign In'? <div></div>:
                    <input className="bg-transparent text-center border rounded-3xl p-4 w-10/12 caret-gray-50 text-xl text-gray-50" type="email" placeholder="Email"/>
                }
                <input className="bg-transparent text-center border rounded-3xl p-4 w-10/12 caret-gray-50 text-xl text-gray-50 my-5" type="text" placeholder="Username"/>
                <input className="bg-transparent text-center border rounded-3xl p-4 w-10/12 caret-gray-50 text-xl text-gray-50" type="password" placeholder="Password"/>
            </div>

            <div className="flex flex-col items-center mt-5">
                <div className={`${ action === "Create Account" ? "grid-cols-1" : "grid-cols-2"} grid items-center w-10/12 gap-4`}>
                    {
                        action === 'Sign In'? (
                        <>
                            <button className="hover:bg-zinc-800 text-xl font-semibold rounded-3xl text-gray-50 bg-zinc-700 p-4 w-full"
                            onClick={ () => { setAction('Create Account') } }> 
                                Sign Up
                            </button>
                            <button className="hover:bg-zinc-800 text-xl font-semibold rounded-3xl text-gray-50 bg-zinc-700 p-4 w-full"
                            onClick={ () => { setAction('Create Account') } }> 
                                Log In
                            </button>
                        </>
                        ) : (
                            <button className="hover:bg-zinc-800 text-xl font-semibold rounded-3xl text-center text-gray-50 bg-zinc-700 p-4 w-full"
                            onClick={ () => { setAction('Create Account') } }> 
                                Create Account
                            </button>
                        )
                    }
                </div>
            </div>
            

            <div className="flex flex-col items-center mt-5"> 
                {action==='Sign In'?<div></div>:
                <div className="grid grid-cols-3 text-gray-50 w-10/12">
                    <p className="text-xl py-4 text-center">Already have an account?</p> 
                    <button className="hover:bg-zinc-800 col-span-2 text-xl font-semibold rounded-3xl text-center text-gray-50 bg-zinc-700 p-4 w-full"
                    onClick={ () => { setAction('Sign In') } }> 
                        Sign In
                    </button>
                </div>}
            </div>
        </div>
    );
}

export default AuthForm;