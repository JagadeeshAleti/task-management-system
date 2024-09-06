// TaskItem.js
import React from "react";
import "./styles.css";

const TaskItem = ({ task, username, onEditTask, onDeleteTask, onCompleteTask}) => {
    return (
        <div className={`task-item ${task.completed ? "completed" : ""}`}>
            <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span className={`priority ${task.priority}`}>
                    {task.priority}
                </span>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-details">
                <span className="assigned-to">Assigned To: {username}</span>
                <span className="deadline">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                </span>
            </div>
            <div className="edit-actions">
                {!task?.completed ? 
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/16208/16208195.png"
                        onClick={() => onCompleteTask(task._id, "mark as completed")} 
                    /> :
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/169/169779.png"
                        onClick={() => onCompleteTask(task._id, "unmark")} 
                    />
                }
                <img                    
                    src="https://cdn-icons-png.flaticon.com/512/5253/5253658.png"
                    onClick={() => onEditTask(task._id)}
                />
                <img                     
                    src="https://cdn-icons-png.flaticon.com/512/6048/6048190.png"
                    onClick={() => onDeleteTask(task._id)}
                />

            </div>
        </div>
    );
};

export default TaskItem;
