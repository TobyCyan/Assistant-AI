import React from 'react';
import { useTokenContext } from '../TokenContext/TokenContext';
import AddEditTasks from './AddEditTasks';

export const isoDateToDateOnly = (isoDate) => {
    const dateOnly = isoDate.split('T')[0]
    return dateOnly
}

const EditTasks = ({tasksToEdit}) => {
    const { tokenStatus, userInfo, tasksInfo } = useTokenContext()
    const [userData, setUserData] = userInfo
    const [tasks, setTasks] = tasksInfo
    
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
        {showTasksToEdit.length != 0 ? (
            <ul>
            {showTasksToEdit}
            </ul>
            ) : (
            <>
                <h2 className='emptyEditTaskList'>You have not selected any tasks to edit!</h2> 
            </>
        )}
        </>
    )
}

export default EditTasks