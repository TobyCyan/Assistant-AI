import './App.css';
import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import SignUp from "./pages/SignUp.jsx"
import MyTasks from "./pages/MyTasks.jsx"
import { Reminder } from './components/TaskReminder/Reminder.jsx';
import PrivateRoutes from "./pages/PrivateRoutes/PrivateRoutes.jsx";

const routes = (
    <BrowserRouter>
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route element={<PrivateRoutes/>}>
                <Route path="/tasks" exact element = {<MyTasks/>} />
                <Route path="/reminder" exact element={<Reminder />}/>
            </Route>
        </Routes>
    </BrowserRouter>
);

function App() {
    return (
        <div>
            {routes}
        </div>
    );
}

export default App;
