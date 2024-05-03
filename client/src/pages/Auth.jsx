import React from 'react';
import AuthForm from '../components/AuthForm'
import LutoLogo from "../assets/luto_logo_white.png" 

function Auth(props) {
    return (
        <div className="grid grid-cols-2 p-2 h-svh bg-gradient-to-b from-orange-500 to-orange-400 gap-2">
            <div className="flex flex-col items-center justify-center">
                <img className="" src={LutoLogo} alt=""/>
                <p className="mt-2 text-gray-50 text-4xl">Community with a Recipe.</p>
            </div>
            <AuthForm />
        </div>
    );
}

export default Auth;