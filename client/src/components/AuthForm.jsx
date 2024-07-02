import React, { useRef } from 'react'

function AuthForm(p) {
    const user = p.user
    const setUser = p.setUser

    const action = p.action
    const setAction = p.setAction
    const password = p.password
    const setPassword = p.setPassword
    const passwordAgain = p.passwordAgain
    const setPasswordAgain = p.setPasswordAgain
    const setShowModal = p.setShowModal
    const setModalMessage = p.setModalMessage
    const isCredsCorrect = p.isCredsCorrect
    const setIsCredsCorrect = p.setIsCredsCorrect
    const handleCreate = p.handleCreate
    const signIn = p.signIn
    const createAccount = p.createAccount

    const passwordRef = useRef(null) 
    const passswordAgainRef = useRef(null)
    
    function handleEnterKey(e, ref) {
        if (e.key !== 'Enter') {
            return
        }

        if (action === "Sign In") {
            if (document.activeElement) {
                document.activeElement.blur()
            }

            handleSignIn()

            return
        }

        if (e.target.id === "password") {
            focusInput(e, ref)

            return
        }

        if (document.activeElement) {
            document.activeElement.blur()
        }

        handleSignUp()
    }



    function handleSignUp() {
        if (!user.username || !password || !passwordAgain) {
            setShowModal(true)

            setModalMessage('Please provide all required details to create an account')

            setIsCredsCorrect(false)

            return
        } else if (password !== passwordAgain) {
            setShowModal(true)

            setModalMessage('Passwords do not match. Please re-enter your password.')
            
            setIsCredsCorrect(false)

            return
        }

        createAccount()
    }

    function handleSignIn() {
        if (!user.username || !password) {
            setShowModal(true)

            setModalMessage('Please enter both username and password to log in.')

            setIsCredsCorrect(false)

            return
        }

        signIn()
    }

    function focusInput(e, ref) {
        if (e.key === 'Enter' && ref.current) {
            ref.current.focus()
        }
    }

    function handleActionChange(action) {
        setUser({ username: '', userId: '' })
        setPassword('')
        setPasswordAgain('')
        setIsCredsCorrect(true)
        setAction(action) 
    }

    return (
        <div className="flex flex-col shadow-md shadow-zinc-950 bg-zinc-875 rounded-3xl justify-center py-5">
            <div className="flex flex-col items-center">
                <h1 className="text-zinc-100 text-5xl font-bold">{ action }</h1>
            </div>
            <div className="flex flex-col mt-10 items-center">
                <input 
                    className={`${isCredsCorrect ? "border-zinc-100" : "border-red-600" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 my-5`} 
                    value={ user.username } onChange={ e => { setUser({ username: e.target.value}) } } 
                    type="text" placeholder="Username"
                    onKeyDown={ e => { focusInput(e, passwordRef) } }
                />
                <input 
                    className={`${isCredsCorrect ? "border-zinc-100" : "border-red-600" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 mb-5`} 
                    value={ password } onChange={ (e) => { setPassword(e.target.value) } } 
                    type="password" placeholder="Password"
                    onKeyDown={ e => { handleEnterKey(e, passswordAgainRef) } } ref={ passwordRef }
                    id="password"
                />
                {
                    action === "Sign Up" &&
                    <input 
                        className={`${isCredsCorrect ? "border-zinc-100" : "border-red-600" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 mb-5`} 
                        value={ passwordAgain } onChange={ (e) => { setPasswordAgain(e.target.value) } } 
                        type="password" placeholder="Password Again"
                        onKeyDown={ e => { handleEnterKey(e) } } ref={ passswordAgainRef }
                    />
                }
            </div>
            <div className="flex flex-col items-center mt-5">
                <div className="grid items-center w-10/12 gap-3">
                    {
                        action === "Sign In"? (
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-700 text-xl font-semibold rounded-3xl text-zinc-100 bg-zinc-600 p-3 w-full" onClick={ () => { handleSignIn() } }> 
                                Log In
                            </button>
                        ) : (
                            <button className="shadow-md shadow-zinc-950 hover:bg-zinc-700 text-xl font-semibold rounded-3xl text-center text-zinc-100 bg-zinc-600 p-3 w-full" onClick={ () => { handleSignUp() }}> 
                                Create Account
                            </button>
                        )
                    }
                </div>
            </div>
            <div className="flex flex-col items-center mt-5"> 
                {
                    action === "Sign In" ? 
                    <div className="grid grid-cols-3 gap-6 text-zinc-100 w-10/12">
                        <p className="text-xl py-4 text-center overflow-hidden text-ellipsis line-clamp-2">Don't have an account?</p> 
                        <button className="shadow-md shadow-zinc-950 hover:bg-zinc-700 col-span-2 text-xl font-semibold rounded-3xl text-zinc-100 bg-zinc-600 p-3 w-full" onClick={ () => { handleActionChange("Sign Up") } }> 
                            Sign Up
                        </button>
                    </div> 
                    :
                    <div className="grid grid-cols-3 gap-6 text-zinc-100 w-10/12">
                        <p className="text-xl py-4 text-center overflow-hidden text-ellipsis line-clamp-2">Already have an account?</p> 
                        <button className="shadow-md shadow-zinc-950 hover:bg-zinc-700 col-span-2 text-xl font-semibold rounded-3xl text-center text-zinc-100 bg-zinc-600 p-3 w-full" onClick={ () => { handleActionChange("Sign In") } }> 
                            Sign In
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default AuthForm