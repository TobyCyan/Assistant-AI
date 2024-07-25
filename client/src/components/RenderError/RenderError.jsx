import React, { ReactNode } from "react"

/**
 * This component renders the empty username error.
 * @param {string} error Error that the user may encounter when signing up.
 * @returns {ReactNode} A React element that renders the empty username sign up error.
 */
const renderUsernameError = (error) => {
    if (error == 'UsernameError') {
        return (
            <div className='error'>
                Username Must Not Be Empty!
            </div>
        )
    } else if (error == 'UsernameSpaceError') {
        return (
            <div className='error'>
                Username Cannot Have Space!
            </div>
        )
    }
}

/**
 * This component renders email error - empty email or existing email.
 * @param {string} error Error that the user may encounter when signing up.
 * @returns {ReactNode} A React element that renders the email sign up error.
 */
const renderEmailError = (error) => {
    if (error == 'EmptyEmailError') {
        return (
            <div className='error'>
                Email Must Not Be Empty!
            </div>
        )
    } else if (error == 'EmailTaken') {
        return (
            <div className='error'>
                Email Already Taken!
            </div>
        )
    } else if (error == 'InvalidEmail') {
        return (
            <div className="error">
                Invalid Email!
            </div>
        )
    }
}

/**
 * This component renders the password mismatch error.
 * @param {string} error Error that the user may encounter when signing up.
 * @returns {ReactNode} A React element that renders the password mismatch sign up error.
 */
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
    } else if (error == 'SpacePW') {
        return (
            <div className='error'>
                Password cannot have space!
            </div>
        )
    }
}

/**
 * This component renders the username taken error.
 * @param {string} error Error that the user may encounter when signing up.
 * @returns {ReactNode} A React element that renders the username taken sign up error.
 */
const renderSignUpError = (error) => {
    if (error == 'UsernameTaken') {
        return (
            <div className='error'>
                Username Already Taken!
            </div>
        )
    }
}

/**
 * This component renders the empty or invalid date of birth error.
 * @param {string} error Error that the user may encounter when signing up.
 * @returns {ReactNode} A React element that renders the empty or invalid date of birth sign up error.
 */
const renderDateOfBirthError = (error) => {
    if (error == 'EmptyDOB') {
        return (
            <div className='error'>
                Please Fill Up Your Birthday!
            </div>
        )
    } else if (error == 'DOBFuture') {
        return (
            <div className='error'>
                Date Of Birth Cannot Be In Future
            </div>
        )
    }
}

/**
 * This component renders the invalid user credentials error.
 * @param {string} error Error that the user may encounter when logging in.
 * @returns {ReactNode} A React element that renders the invalid user credentials log in error.
 */
const renderInvalidCredentialsError = (error) => {
    if (error == 'InvalidCreds') {
        return (
            <div className='error'>
                Invalid Username or Password!
            </div>
        )
    }
}

/**
 * This component renders the empty task title error.
 * @param {string} error Error that the user may encounter when adding a task.
 * @returns {ReactNode} A React element that renders the empty task title add task error.
 */
const renderNoTaskTitleError = (error) => {
    if (error == 'noTaskTitle') {
        return (
            <div className='error'>
                Please Enter A Title!
            </div>
        )
    }
}

/**
 * This component renders the empty task category error.
 * @param {string} error Error that the user may encounter when adding a task.
 * @returns {ReactNode} A React element that renders the empty task category add task error.
 */
const renderNoTaskCategoryError = (error) => {
    if (error == 'noTaskCategory') {
        return (
            <div className='error'>
                Please Enter A Category!
            </div>
        )
    }
}

/**
 * This component renders the invalid task priority, deadline and reminder error.
 * @param {string} error Error that the user may encounter when adding a task.
 * @returns {ReactNode} A React element that renders the invalid task priority, deadline and reminder add task error.
 */
const renderPriorityOrDateError = (error) => {
    if (error == 'noTaskPriority') {
        return (
            <div className='error'>
                Please Enter A Priority Level!
            </div>
        )
    } else if (error == 'noTaskDeadline') {
        return (
            <div className='error'>
                Please Enter A Deadline!
            </div>
        )
    } else if (error == 'deadlinePast') {
        return (
            <div className='error'>
                Deadline Cannot Be In The Past!
            </div>
        )
    } else if (error == 'noTaskReminder') {
        return (
            <div className='error'>
                Please Enter A Reminder!
            </div>
        )
    } else if (error == 'reminderPast') {
        return (
            <div className='error'>
                Reminder Cannot be In The Past!
            </div>
        )
    } else if (error == 'reminderBeforeDeadline') {
        return (
            <div className='error'>
                Reminder Must Come Before Deadline!
            </div>
        )
    }
}

/**
 * This component renders the weak password error.
 * @param {string} error Error that the user may encounter when signing up.
 * @returns {ReactNode} A React element that renders the weak password sign up error.
 */
const renderWeakPWError = (error) => {
    if (error == 'WeakPW') {
        return (
            <>
                <div className='error'>Password Must Have:</div>
                <div className='error'>
                    At Least 8 Characters.
                </div>
                <div className='error'>
                    At Least 1 Lowercase and Uppercase Alphabet.
                </div>
                <div className='error'>
                    At Least 1 Number.
                </div>
            </>
        )
    }
}

export default {
    renderDateOfBirthError,
    renderUsernameError,
    renderEmailError,
    renderPWError,
    renderSignUpError,
    renderInvalidCredentialsError,
    renderNoTaskTitleError,
    renderNoTaskCategoryError,
    renderPriorityOrDateError,
    renderWeakPWError,
}