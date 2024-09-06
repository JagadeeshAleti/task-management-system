import React from "react";

const TaskForm = ({ newTask, handleInputChange, assignees, editTask, onCancelTask, handleSubmit }) => {
    return (
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
                        {assignees.map((a) => (
                            <option value={a._id} key={a._id}>
                                {a.username}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={handleInputChange}
                        required
                    />

                    {editTask && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "4px",
                            }}
                        >
                            <input
                                type="checkbox"
                                name="completed"
                                checked={newTask.completed}
                                onChange={handleInputChange}
                            />
                            Mark as completed
                        </div>
                    )}
                    <div className="modal-actions">
                        <button
                            className="cancel"
                            onClick={() => onCancelTask()}
                        >
                            Cancel
                        </button>
                        <button
                            className="submit"
                            onClick={(e) => handleSubmit(e)}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
