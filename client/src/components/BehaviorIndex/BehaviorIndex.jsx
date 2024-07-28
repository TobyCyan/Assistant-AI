import React, { ReactNode } from "react";

/**
 * A React component that displays the full behavioral index, showing the user the possible input patterns and description of the response.
 * @component
 * @returns {ReactNode} A React element that renders the behavior index.
 */
const behaviorIndex = () => {
    
    return (
        <>
            <table className="behaviorIndexTable">
                <tbody>
                    <tr>
                        <td className="indexTitle">Input Pattern</td>
                        <td className="indexTitle">Response Description</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Who are you?</li>
                                <li>What’s your name?</li>
                                <li>Can you introduce yourself.</li>
                            </ul>
                        </td>
                        <td>Introduction of the AI Assistant to the user.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Give me all my tasks.</li>
                                <li>My list of tasks.</li>
                                <li>What tasks do I have?</li>
                            </ul>
                        </td>
                        <td>The complete list of the user's tasks.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Favorite food.</li>
                                <li>What is your favorite food?</li>
                                <li>What do you like to eat?</li>
                            </ul>
                        </td>
                        <td>Free talk about the AI Assistant's favorite food.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Favorite color.</li>
                                <li>What is your favorite color?</li>
                                <li>What color do you like?</li>
                            </ul>
                        </td>
                        <td>Free talk about the AI Assistant's favorite color.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>What do you like?</li>
                                <li>What are your hobbies?</li>
                            </ul>
                        </td>
                        <td>Free talk about the Assistant's hobbies.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Shop.</li>
                                <li>Tell me about the shop.</li>
                                <li>What is the shop?</li>
                            </ul>
                        </td>
                        <td>Introduction to the application's shop page.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Completion.</li>
                                <li>Completing tasks.</li>
                                <li>Incompletion.</li>
                            </ul>
                        </td>
                        <td>Introduction to the application's task completion/ uncompletion system.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Productivity Report</li>
                                <li>What is my productivity report?</li>
                                <li>Tell me about the productivity report.</li>
                            </ul>
                        </td>
                        <td>Introduction to the application's productivity report system.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Hey!</li>
                                <li>Hello.</li>
                                <li>Good to see you.</li>
                                <li>How are you?</li>
                                <li>What's Up?</li>
                                <li>Hi</li>
                            </ul>
                        </td>
                        <td>Greeting the user.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Can you add a task for me?</li>
                                <li>Add a task.</li>
                                <li>Add task.</li>
                            </ul>
                        </td>
                        <td>Guides the user through the process of adding a new task.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Can you delete this task for me please?</li>
                                <li>Delete a task.</li>
                                <li>Delete task.</li>
                            </ul>
                        </td>
                        <td>Guides the user through the process of deleting an existing task.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Can you edit this task for me please?</li>
                                <li>Edit a task.</li>
                                <li>Edit task.</li>
                            </ul>
                        </td>
                        <td>Guides the user through the process of editing an existing task.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>What is the weather today?</li>
                                <li>Weather</li>
                            </ul>
                        </td>
                        <td>Informs the user about the weather in their local area.</td>
                    </tr>
                    
                    <tr>
                        <td>
                            <ul>
                                <li>Priority task.</li>
                                <li>Highest prioritised task.</li>
                                <li>What tasks should I prioritise.</li>
                            </ul>
                        </td>
                        <td>A suggestion from the AI Assistant about the user's highest prioritised task.</td>
                    </tr>         
                </tbody>
            </table>
        </>
    )
}

export default behaviorIndex