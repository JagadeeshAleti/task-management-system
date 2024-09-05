import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import TaskList from "./components/Tasks/TaskList";
import RealTimeFeed from "./components/RealTimeFeed";
import AuthWrapper from "./components/Auth/AuthWrapper";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<AuthWrapper />}>
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/feed" element={<RealTimeFeed />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
