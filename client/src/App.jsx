import './App.css';
import React, {ReactNode} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import SignUp from "./pages/SignUp.jsx"
import MyTasks from "./pages/MyTasks.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import Shop from './pages/Shop.jsx';
import Profile from "./pages/Profile.jsx";
import PrivateRoutes from "./pages/PrivateRoutes/PrivateRoutes.jsx";
import Scheduler from "./pages/Scheduler.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";

/**
 * The routes of the web application.
 * @type {ReactNode}
 */
const routes = (
    <BrowserRouter>
        <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/updateprofile" exact element={<UpdateProfile />} />
            <Route element={<PrivateRoutes/>}>
                <Route path="/" exact element={<Home />} />
                <Route path="/tasks" exact element = {<MyTasks />} />
                <Route path="/shop" exact element={<Shop />} />
                <Route path="/users/:username" exact element={<Profile />} />
                <Route path="/recurringtasks" exact element={<Scheduler/>}/>
                <Route path="/chatpage" exact element={<ChatPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);

/**
 * The React component of the web application.
 * @returns {ReactNode} A React element that renders all the available routes.
 */

function App() {
    return (
        <div>
            {routes}
        </div>
    );
}

export default App;
