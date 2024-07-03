import React, { useState, useLayoutEffect, useRef } from 'react'
import axios from 'axios'

import NavBar from '../components/NavBar'
import ConfirmModal from '../components/ConfirmModal'
import Textarea from '../components/Textarea'

import LogOutIcon from '../assets/log-out-icon.png'
import ProfileIcon from '../assets/profile-icon.png'

function Settings(p) {
    const user = p.user
    const setUser = p.setUser
    const currentTab = p.currentTab
    const setCurrentTab = p.setCurrentTab
    const handleLogOut = p.handleLogOut
    const setShowModal = p.setShowModal
    const setModalMessage = p.setModalMessage

    const [confirmationShown, setConfirmationShown] = useState()
    const [isChangingPassword, setIsChangingPassword] = useState()
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')
    const [bio, setBio] = useState(user.bio || '')
    const inputRef = useRef(null)
    const buttonRef = useRef(null)

    function focusInput(e, ref) {
        if (e.key === 'Enter' && ref.current) {
            ref.current.focus()
        }
    }

    console.log(user)

    function handleChangePassword() {
        axios.post(`http://localhost:8080/change-password`, { userId: user.userId, password })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)

                setPassword('')
                setPasswordAgain('')
                setIsChangingPassword(false)
                setShowModal(true)
                setModalMessage('Password successfully changed.')
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function handleFileChange(e) {
        const file = e.target.files[0]
        const maxSizeInBytes = 5 * 1024 * 1024

        if (file && file.size > maxSizeInBytes) {
            // placeholder
            return alert('File size exceeds the maximum allowed limit (5MB). Please Select a smaller file.')
        } else if (!file) {
            return
        }
        
        setUser({...user, profilePicture: URL.createObjectURL(file)})

        const formData = new FormData()

        formData.append('userId', user.userId)
        formData.append(`file-profile`, file)

        axios.post(`http://localhost:8080/change-profile-picture`, formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)

                setShowModal(true)
                setModalMessage('Profile picture successfully changed.')
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    function handleChangeBio() {
        axios.post(`http://localhost:8080/change-bio`, { userId: user.userId, bio })
            .then(response => {
                console.log('Status Code:' , response.status)
                console.log('Data:', response.data)

                setShowModal(true)
                setModalMessage('Bio successfully changed.')
            })
            .catch(err => {
                console.log('Error Status:', err.response.status)
                console.log('Error Data:', err.response.data)
            })
    }

    useLayoutEffect(() => {
        setCurrentTab('Settings')
        setIsChangingPassword(false)
    }, [])

    if (currentTab !== 'Settings') {
        return
    }

    return (
        <div>
            <NavBar 
                user={ user } currentTab={ currentTab }
                setCurrentTab={ setCurrentTab } setConfirmationShown={ setConfirmationShown }
            />
            <div className="flex flex-col gap-3 p-3 h-svh bg-zinc-900">
                {/* space for top navbar */}
                <div className="grid w-full gap-3 h-16" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="col-span-11 h-16 rounded-3xl bg-zinc-800" style={ { gridColumn:  "span 13" } }></div>
                    <div className="col-span-2"></div>     
                </div>
                {/* content */}
                <div className="grid w-full gap-3 h-full" style={ { gridTemplateColumns: "repeat(15, minmax(0, 1fr))" } }>
                    <div className="col-span-2"></div>
                    <div className="flex flex-col p-9 bg-zinc-800 rounded-3xl text-zinc-100" style={ { gridColumn: "span 13" } }>
                        <p className="text-3xl font-bold mb-3">Account Settings</p>
                        <p className="text-lg mb-6 text-zinc-400">Account Preferences</p>
                        <p className="text-xl mb-6">Change Profile Picture</p>
                        <div className="grid grid-cols-2 mb-6 h-24">
                            <img className="w-24 h-24 object-cover rounded-full" src={ user.profilePicture || ProfileIcon } alt="" />
                            <div className="flex justify-end items-center">
                                <button className="flex p-3 w-44 rounded-3xl bg-zinc-700 hover:bg-zinc-500">
                                    <label className="flex w-full h-full justify-center text-zinc-100 border-zinc-500 rounded-3xl cursor-pointer" htmlFor="input">
                                        Upload Image
                                    </label>
                                    <input className="hidden" id="input" type="file" accept="image/*" onChange={ e => handleFileChange(e) } />
                                </button>
                            </div>
                        </div>
                        <p className="text-xl mb-6">Change Bio</p>
                        <div className="flex flex-row gap-6">
                            <div className="w-11/12">
                                <Textarea 
                                    attribute="px-3 text-lg w-full font-semibold bg-zinc-600 focus:bg-zinc-600" 
                                    maxLength={ 200 } value={ bio } setValue={ setBio } 
                                    placeholder="How would you describe yourself?" 
                                />
                            </div>
                            <div className="flex w-full justify-end">
                                <button className="p-3 w-44 h-fit rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { handleChangeBio() } }>
                                    Change Bio
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 mb-6 h-24">
                            <div className="flex flex-row h-full items-center">
                                <div className="w-full">
                                    <p className="text-xl">Change Password</p>
                                    <p className="text-lg text-zinc-400">Pasword must be at least 8 characters long</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-6 items-center justify-end">
                                {
                                    isChangingPassword ?
                                    <>
                                        <div className="flex gap-3">
                                            <input 
                                                className={`${ password !== passwordAgain && "border-red-600" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 my-5`} 
                                                value={ password } onChange={ e => { setPassword(e.target.value) } } 
                                                type="password" placeholder="Password"
                                                onKeyDown={ e => { focusInput(e, inputRef) } }
                                            />
                                            <input 
                                                className={`${ password !== passwordAgain && "border-red-600" } bg-transparent text-center border rounded-3xl p-3 w-10/12 caret-zinc-100 text-xl text-zinc-100 my-5`} 
                                                value={ passwordAgain } onChange={ e => { setPasswordAgain(e.target.value) } } 
                                                type="password" placeholder="Password again" ref={ inputRef }
                                                onKeyDown={ e => { focusInput(e, buttonRef) } }
                                            />
                                        </div>
                                        <button 
                                            className={`${ password && passwordAgain && password === passwordAgain ? "hover:bg-zinc-500" : "" } p-3 w-44 rounded-3xl bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-800`} 
                                            disabled={ password !== passwordAgain || password === "" || passwordAgain === "" } ref={ buttonRef }
                                            onClick={ () => { handleChangePassword() } }
                                        >
                                            Change
                                        </button>
                                    </>
                                    :
                                    <button className="p-3 w-44 rounded-3xl bg-zinc-700 hover:bg-zinc-500" onClick={ () => { setIsChangingPassword(true) } }>
                                        Change
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* confirm modal */}
                {
                    confirmationShown === "log out" &&
                    <ConfirmModal 
                        setShowModal={ setConfirmationShown } confirmAction={ handleLogOut }
                        headerText={ "Confirm Log Out" } bodyText={ "Are you sure you want to log out?" }
                        icon={ LogOutIcon } isDanger={ true }
                    />
                }
            </div>
        </div>
    )
}

export default Settings