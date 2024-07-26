import React from "react"

const renderEmptyUsernameError = (error) => {
    if (error == 'UsernameError') {
        return (
            <div className='error'> 
                Username Must Not Be Empty!
            </div>
        )
    }
}

const renderPWError = (error) => {
    if (error == 'MismatchPW') {
        return (
            <div className='error'>
                Passwords Do Not Match!
            </div>
        )
    } else if (error == 'EmptyPW') {
        return (
            <div className='error'>
                Passwords Must Not Be Empty!
            </div>
        )
    }
}

const renderSignUpError = (error) => {
    if (error == 'UsernameTaken') {
        return (
            <div className='error'>
                Username Already Taken!
            </div>
        )
    }
}

const renderDateOfBirthError = (error) => {
    if (error == 'EmptyDOB') {
        return (
            <div className='error'>
                Please Fill Up Your Birthday!
            </div>
        )
    }
}

const renderInvalidCredentialsError = (error) => {
    if (error == 'InvalidCreds') {
        return (
            <div className='error'>
                Invalid Username or Password!
            </div>
        )
    }
}

export default {
    renderDateOfBirthError,
    renderEmptyUsernameError,
    renderPWError,
    renderSignUpError,
    renderInvalidCredentialsError
}
