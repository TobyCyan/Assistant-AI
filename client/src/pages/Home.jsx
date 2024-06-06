import React, {useState} from 'react'
import NavBar from "../components/NavBar/NavBar.jsx";
import '../index.css'
import TasksBox from "../components/TasksBox/TasksBox";

function Home() {
    const testArray = new Array(9).fill().map((_, index) => ({
        id: index,
        title: "Task",
        message: `Note ${index}`
    }));
    const[isAddTaskModalOpen, setAddTaskModalOpen] = useState(false)

    return (
        <div>
            <NavBar/>
            <div className="homepageContainer">
                <div className="overdueAndRemindersBox">
                    <TasksBox key="Overdued" title="Overdued" tasksToShow={testArray}/>
                    <TasksBox key="Reminders" title="Reminders" tasksToShow={testArray}/>
                </div>
                <div className="upcomingAndPriorityBox">
                    <TasksBox key="Upcoming" title="Upcoming" tasksToShow={testArray}/>
                    <TasksBox key="Priority" title="Priority" tasksToShow={testArray}/>
                </div>
                <div className="assistantCharacterBox">
                    <div className="box">
                        <p>Assistant AI</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;