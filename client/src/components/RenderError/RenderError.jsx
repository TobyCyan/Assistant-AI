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
    } else if (error == 'DOBFuture') {
        return (
            <div className='error'>
                Date Of Birth Cannot Be In Future
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

const renderNoTaskTitleError = (error) => {
    if (error == 'noTaskTitle') {
        return (
            <div className='error'>
                Please Enter A Title!
            </div>
        )
    }
}

const renderNoTaskCategoryError = (error) => {
    if (error == 'noTaskCategory') {
        return (
            <div className='error'>
                Please Enter A Category!
            </div>
        )
    }
}

const renderNoTaskPriorityError = (error) => {
    if (error == 'noTaskPriority') {
        return (
            <div className='error'>
                Please Enter A Priority Level!
            </div>
        )
    }
}

const renderDeadlineError = (error) => {
    if (error == 'noTaskDeadline') {
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
    }
}

const renderReminderError = (error) => {
     if (error == 'noTaskReminder') {
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
    renderEmptyUsernameError,
    renderPWError,
    renderSignUpError,
    renderInvalidCredentialsError,
    renderNoTaskTitleError,
    renderNoTaskCategoryError,
    renderNoTaskPriorityError,
    renderDeadlineError,
    renderReminderError,
    renderWeakPWError,
}