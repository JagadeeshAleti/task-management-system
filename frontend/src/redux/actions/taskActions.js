import axios from "axios";

export const createTask = (task) => async (dispatch) => {
    try {
        const { data } = await axios.post("http://localhost:7000/api/tasks", task, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: "CREATE_TASK_SUCCESS", payload: data });
    } catch (error) {
        dispatch({ type: "CREATE_TASK_FAILURE", payload: error.message });
    }
};

export const updateTask = (id, task) => async (dispatch) => {
    try {
        const { data } = await axios.put(`http://localhost:7000/api/tasks/${id}`, task, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: "UPDATE_TASK_SUCCESS", payload: data });
    } catch (error) {
        dispatch({ type: "UPDATE_TASK_FAILURE", payload: error.message });
    }
};

export const deleteTask = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:7000/api/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: "DELETE_TASK_SUCCESS", payload });
    } catch (error) {
        dispatch({ type: "DELETE_TASK_FAILURE", payload: error.message });
    }
};

export const getUserTasks = (userId) => async (dispatch) => {
    try{
        const { data } = await axios.get(`http://localhost:7000/api/tasks/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: "GET_USER_TASKS", payload: data });
    } catch(err) {
        dispatch({ type: "UNABLE_TO_GET_USER_TASKS" })
    }
};
