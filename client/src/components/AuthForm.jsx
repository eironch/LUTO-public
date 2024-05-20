import React from 'react'

function AuthForm(p) {
    return (
        <div className="flex flex-col shadow-sm shadow-zinc-950 bg-zinc-900 rounded-3xl justify-center py-5">
            <div className="flex flex-col items-center">
                <h1 className="text-zinc-100 text-5xl font-bold">{ p.action }</h1>
            </div>
            <div className="flex flex-col mt-10 items-center">
                <input className={`${p.isCredsCorrect ? "border-zinc-100" : "border-red-700" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 my-5`} 
                value={ p.user.username } onChange={ (e) => { p.setUser({ username: e.target.value}) } } type="text" placeholder="Username"/>
                <input className={`${p.isCredsCorrect ? "border-zinc-100" : "border-red-700" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 mb-5`} 
                value={ p.password } onChange={ (e) => { p.setPassword(e.target.value) } } type="password" placeholder="Password"/>
                {
                    p.action === "Sign In"? <div></div>:
                    <input className={`${p.isCredsCorrect ? "border-zinc-100" : "border-red-700" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 mb-5`} 
                    value={ p.passwordAgain } onChange={ (e) => { p.setPasswordAgain(e.target.value) } } type="password" placeholder="Password"/>
                }
            </div>
            <div className="flex flex-col items-center mt-5">
                <div className="grid items-center w-10/12 gap-3">
                    {
                        p.action === "Sign In"? (
                            <button className="shadow-sm shadow-zinc-950 hover:bg-zinc-800 text-xl font-semibold rounded-3xl text-zinc-100 bg-zinc-700 p-3 w-full"
                                onClick={ () => { 
                                        if (!p.user.username || !p.password) {
                                            p.setShowModal(true)
                                            p.setModalMessage("Please enter both username and password to log in.")
                                            p.setIsCredsCorrect(false)
                                            return
                                        }

                                        p.signIn()
                                    } 
                                }
                            > 
                                Log In
                            </button>
                        ) : (
                            <button className="shadow-sm shadow-zinc-950 hover:bg-zinc-800 text-xl font-semibold rounded-3xl text-center text-zinc-100 bg-zinc-700 p-3 w-full"
                                onClick={ () => {
                                        if (!p.user.username || !p.password || !p.passwordAgain) {
                                            p.setShowModal(true)
                                            p.setModalMessage("Please provide all required details to create an account")
                                            p.setIsCredsCorrect(false)
                                            return
                                         } else if (p.password !== p.passwordAgain) {
                                            p.setShowModal(true)
                                            p.setModalMessage("Passwords do not match. Please re-enter your password.")
                                            p.setIsCredsCorrect(false)
                                            return
                                        }

                                        p.createAccount()
                                    }
                                }
                            > 
                                Create Account
                            </button>
                        )
                    }
                </div>
            </div>
            <div className="flex flex-col items-center mt-5"> 
                {
                    p.action === "Sign In" ? 
                    <div className="grid grid-cols-3 text-zinc-100 w-10/12">
                        <p className="text-xl py-4 text-center overflow-hidden text-ellipsis line-clamp-2">Don't have an account?</p> 
                        <button className="shadow-sm shadow-zinc-950 hover:bg-zinc-800 col-span-2 text-xl font-semibold rounded-3xl text-zinc-100 bg-zinc-700 p-3 w-full"
                            onClick={ () => {
                                    p.setUser({ username: '', userId: '' })
                                    p.setPassword('')
                                    p.setPasswordAgain('')
                                    p.setIsCredsCorrect(true)
                                    p.setAction("Create Account") 
                                }
                            }
                        > 
                            Sign Up
                        </button>
                    </div> 
                    :
                    <div className="grid grid-cols-3 text-zinc-100 w-10/12">
                        <p className="text-xl py-4 text-center overflow-hidden text-ellipsis line-clamp-2">Already have an account?</p> 
                        <button className="shadow-sm shadow-zinc-950 hover:bg-zinc-800 col-span-2 text-xl font-semibold rounded-3xl text-center text-zinc-100 bg-zinc-700 p-3 w-full"
                            onClick={ () => { 
                                    p.setUser({ username: '', userId: '' })
                                    p.setPassword('')
                                    p.setPasswordAgain('')
                                    p.setIsCredsCorrect(true)
                                    p.setAction("Sign In")
                                }
                            }
                        > 
                            Sign In
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default AuthForm