import React, { useEffect, useState } from 'react';
import { useTokenContext } from '../TokenContext/TokenContext';
import AddEditTasks from './AddEditTasks';

const EditTasks = ({tasksToEdit}) => {
    const { tokenStatus, userInfo, tasksInfo } = useTokenContext()
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo

    const isoDateToDateOnly = (isoDate) => {
        const dateOnly = isoDate.split('T')[0]
        return dateOnly
    }
    
    const showTasksToEdit = tasksToEdit.map((task, index) => (
            <AddEditTasks 
            key={index}
            taskId={task.id}
            editTitle={task.title}
            editDescription={task.description}
            editCategory={task.category}
            editDeadline={isoDateToDateOnly(task.deadline)}
            editPriority={task.priority}
            editReminder={task.reminder}
            submitType={'edit'}
            />
        )
    )
    return (
        <>
        {showTasksToEdit}
        </>
    )
}

export default EditTasks