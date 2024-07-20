import './App.css';
import React, {ReactNode} from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import SignUp from "./pages/SignUp.jsx"
import MyTasks from "./pages/MyTasks.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import Shop from './pages/Shop.jsx';
import Profile from "./pages/Profile.jsx";
import PrivateRoutes from "./pages/PrivateRoutes/PrivateRoutes.jsx";
import RecurringTasks from "./pages/RecurringTasks.jsx";

/**
 * The routes of the web application.
 * @type {ReactNode}
 */
const routes = (
    <BrowserRouter>
        <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route element={<PrivateRoutes/>}>
                <Route path="/" exact element={<Home />} />
                <Route path="/tasks" exact element = {<MyTasks />} />
                <Route path="/shop" exact element={<Shop />} />
                <Route path="/users/:username" exact element={<Profile />} />
                <Route path="/recurringTasks" exact element={<RecurringTasks/>}/>
                <Route path="/chatpage" exact element={<ChatPage />} />
            </Route>
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
