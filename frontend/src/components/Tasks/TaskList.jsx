import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask, deleteTask, updateTask } from "../../redux/actions/taskActions";
import TaskItem from "./TaskItem/TaskItem";
import * as jwt from "jwt-decode"
import { getUsers } from "../../redux/actions/userActions";
import { getUserTasks } from "../../redux/actions/taskActions"

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
        assignees = users.filter(u => u.role === "user")
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
        editTask ? dispatch(updateTask(newTask?.taskId, newTask)) :dispatch(createTask(newTask));
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

    const onCancelTask = () => {
        setShowModal(false);
        if(editTask) {
            setNewTask(DEAFULT_TASK);
        }
    };

    return (
        <div className="tasks-list">
            <div className="header">
                <div className="main">{`Hello, ${userDetails?.username}`}</div>
                <div className="action">
                    <button className="cancel" onClick={() => {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }}>Logout</button>
                    <button className="submit" onClick={() => {setShowModal(true)}}>Create Task</button>
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
            <div className={`tasks-list-container ${showModal ? 'blur-background' : ''}   `}>
                {tasks.map((task) => (
                    <TaskItem 
                        key={task._id} 
                        task={task} 
                        onEditTask={onEditTask}
                        onDeleteTask={onDeleteTask}
                        username={getUsername(task.assignedTo)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskList;
