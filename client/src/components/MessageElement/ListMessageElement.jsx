import React, { ReactNode } from "react";

/**
 * The React component that displays the list of user tasks in separate lines.
 * @component
 * @param {Array<string>} taskList The list of task to be rendered in separate lines.
 * @returns {ReactNode} A React element that renders the task list message element.
 */
const listMessageElement = ({list}) => {
    const listText = list.map((task, index) => {
        return <div key={index}>{task} <br /></div>
    })

    return (
        <>
            {listText}
        </>
    )
}

export default listMessageElement