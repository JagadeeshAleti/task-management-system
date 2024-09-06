import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, deleteTask, updateTask } from "../../redux/actions/taskActions";
import TaskItem from "./TaskItem/TaskItem";
import * as jwt from "jwt-decode"
import { getUsers, updateUser } from "../../redux/actions/userActions";
import { getUserTasks } from "../../redux/actions/taskActions"
import ManagerCard from "../Manager/Managers";
import TaskForm from "./TaskForm";

const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
};

const DEAFULT_TASK = {
    title: "",
    assignedTo: "",
    description: "",
    priority: "low",
    deadline: getCurrentDate(),
    completed: false
};

const TaskList = () => {
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState(DEAFULT_TASK);

    const [editTask, setEditTask] = useState(false);
    const [addUser, setAddUser] = useState(false);

    const [manageUsers, setManageUsers] = useState(false);
    
    const [selectedManager, setSelectedManager] = useState('');
    const [selectedUser, setSelectedUser] = useState("");

    const dispatch = useDispatch();

    const tasks = useSelector((state) => state?.tasks?.tasks);
    const users = useSelector((state) => state?.users?.users);
    
    const token = localStorage.getItem("token");
    const { role, userId } = jwt.jwtDecode(token);
    const [userDetails] = users.filter(u => u._id === userId);

    useEffect(() => { 
        dispatch(getUsers());
        dispatch(getUserTasks(userId))
    }, [])

    let assignees;
    if(role === "admin") {
        assignees = users.filter(u => u.role == "user" || u.role == "manager")
    } 
    if(role === "manager") {
        assignees = users.filter(u => u.manager === userId)
    }
    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let assignedTo = newTask.assignedTo ? newTask.assignedTo : assignees[0]; 
        editTask ? dispatch(updateTask(newTask?.taskId, newTask)) :dispatch(createTask({ ...newTask, assignedTo }));
        setShowModal(false);
        setNewTask(DEAFULT_TASK);
        dispatch(getUserTasks(userId));
    };

    const getUsername = (id) => {
        const [user] = users.filter(u => u._id == id);
        return user?.username;
    }

    const onEditTask = (id) => {
        setEditTask(true);
        const [taskClicked] = tasks.filter(t => t._id == id);
        const { title, description, assignedTo, priority, deadline, completed } = taskClicked;
        let date = new Date(deadline).toISOString().split("T")[0];
        setNewTask({ title, description, assignedTo, priority, deadline: date, completed, taskId: id});
        setShowModal(true);
    }

    const onDeleteTask = (id) => {
        const confirmed = window.confirm("Are you sure want to delete this task?");
        if(confirmed) {
            dispatch(deleteTask(id))
        }
        dispatch(getUserTasks(userId));
    }

    const onCompleteTask = (id, decision) => {
        let confirm = decision === "unmark" ?
            window.confirm("Are you sure want to mark this task as not completed?") :
            window.confirm("Are you sure want to mark this task as complete?");
        if(!confirm) {
            return;
        }

        dispatch(updateTask(id, { completed: decision === "unmark" ?  false : true }));
        dispatch(getUserTasks(userId));
    }

    const onCancelTask = () => {
        setShowModal(false);
        if(editTask) {
            setNewTask(DEAFULT_TASK);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.reload();
    }

    const managers = users
    .filter(m => m.role === 'manager')
    .map(m => {
        const usersUnderManager = users.filter(u => u.manager === m._id);
        return {
            ...m,
            users: usersUnderManager
        };
    });
        
    const onAddUserToManager = (managerId) => {
        setAddUser(true);
        setSelectedManager(managerId);
    }
    
    const addUserToManager = (e) => {
        e.preventDefault();
        const body = { 
            manager: selectedManager
        }

        let userSelected = !selectedUser ? usersWithoutManagers[0]?._id : selectedUser;
        dispatch(updateUser(userSelected, body));
        setAddUser(false);
        setSelectedManager("");
        dispatch(getUsers());
    }

    const usersWithoutManagers = users.filter(u => u.manager == null && !(["admin", "manager"].includes(u.role)));
    
    return (
        <div className="tasks-list">
            <div className="header">
                <div className="main">{`Hello, ${userDetails?.username}`}</div>
                <div className="action">
                    {!(role === 'user') &&
                        <button className="submit" onClick={() => setShowModal(true)}>Create Task</button>
                    }

                    {(role === 'admin' && !manageUsers)?
                        <button className="submit" onClick={() => setManageUsers(true)}>Manage Users</button>:
                        (role === 'admin') && <button className="submit" onClick={() => setManageUsers(false)}>Tasks</button>
                    }
                    <button className="cancel" onClick={logout}>Logout</button>
                </div>
            </div>

            { showModal && (
                <TaskForm newTask={newTask} handleInputChange={handleInputChange} assignees={assignees} editTask={editTask} onCancelTask={onCancelTask} handleSubmit={handleSubmit}/>
            )}

            { addUser &&
                <form className="task-popup">
                    <h3>Please select user</h3>
                    <select onChange={e => setSelectedUser(e.target.value)}>
                        {
                            usersWithoutManagers.map(a => <option value={a._id} key={a._id}>{a.username}</option>)
                        }
                    </select>
                    <div className="modal-actions">
                        <button className="cancel" onClick={() => { setAddUser(false); setSelectedManager("")}}>Cancel</button>
                        <button className="submit" onClick={e => addUserToManager(e)}>Add</button>
                    </div>
                </form>
            }
            { manageUsers && role == "admin" ?
                <div className={`managers-list ${addUser ? 'blur-background' : ''}`}>
                    {managers.map(m => <ManagerCard key={Math.random()} manager={m} onAddUserToManager={onAddUserToManager} />)}
                </div> :
                <div className={`tasks-list-container ${showModal ? 'blur-background' : ''}   `}>
                    {tasks.map((task) => (
                        <TaskItem key={Math.random()} task={task} onEditTask={onEditTask} onDeleteTask={onDeleteTask} onCompleteTask={onCompleteTask} username={getUsername(task.assignedTo)} />
                    ))}
                </div>
            }
        </div>
    );
};

export default TaskList;
