import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, deleteTask, updateTask } from "../../redux/actions/taskActions";
import TaskItem from "./TaskItem/TaskItem";
import * as jwt from "jwt-decode"
import { getUsers, updateUser } from "../../redux/actions/userActions";
import { getUserTasks } from "../../redux/actions/taskActions"
import ManagerCard from "../Manager/Managers";

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

    const onCompleteTask = (id) => {
        const confirmed = window.confirm("Are you sure want to mark this task as complete?");
        if(confirmed) {
            dispatch(updateTask(id, { completed: true }));
        }
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

    let toogle = false;
    if(role === 'admin') {
        toogle = !manageUsers
    }
    
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
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <form className="task-popup">
                            <h2>Create Task</h2>

                            <input
                                type="text"
                                name="title"
                                value={newTask.title}
                                onChange={handleInputChange}
                                placeholder="Title"
                                required
                            />

                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={newTask.description}
                                onChange={handleInputChange}
                                required
                            />

                            <select
                                name="priority"
                                value={newTask.priority}
                                onChange={handleInputChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>

                            <select
                                name="assignedTo"
                                value={newTask.assignedTo}
                                onChange={handleInputChange}
                            >   
                                {
                                    assignees.map(a => <option value={a._id} key={a._id}>{a.username}</option>)
                                }
                            </select>
                            

                            <input
                                type="date"
                                name="deadline"
                                value={newTask.deadline}
                                onChange={handleInputChange}
                                required
                            />

                            {editTask && 
                            <div style={{display: "flex", alignItems: 'center', gap: '10px', padding: '4px'}}>
                                <input
                                    type="checkbox"
                                    name="completed"
                                    checked={newTask.completed}
                                    onChange={handleInputChange}
                                />
                                Mark as completed
                            </div>
                            }   
                            <div className="modal-actions">
                                <button className="cancel" onClick={() => onCancelTask()}>Cancel</button>
                                <button className="submit" onClick={e => handleSubmit(e)}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {
                addUser &&
                <form className="task-popup">
                    <h3>Please select user</h3>
                    <select onChange={e => setSelectedUser(e.target.value)}>
                        {
                            usersWithoutManagers.map(a => <option value={a._id} key={a._id}>{a.username}</option>)
                        }
                    </select>
                    <div className="modal-actions">
                        <button className="submit" onClick={e => addUserToManager(e)}>Add</button>
                        <button className="cancel" onClick={() => { setAddUser(false); setSelectedManager("")}}>Cancel</button>
                    </div>
                </form>
            }
            {manageUsers && role == "admin" ?
                <div className={`managers-list ${addUser ? 'blur-background' : ''}`}>
                    {managers.map(m => <ManagerCard key={Math.random()} manager={m} onAddUserToManager={onAddUserToManager} />)}
                </div>
            :
            <div className={`tasks-list-container ${showModal ? 'blur-background' : ''}   `}>
                {tasks.map((task) => (
                    <TaskItem 
                        key={task._id} 
                        task={task} 
                        onEditTask={onEditTask}
                        onDeleteTask={onDeleteTask}
                        onCompleteTask={onCompleteTask}
                        username={getUsername(task.assignedTo)}
                    />
                ))}
            </div>}
        </div>
    );
};

export default TaskList;
