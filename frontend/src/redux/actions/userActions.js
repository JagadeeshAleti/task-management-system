import axios from "axios";

export const getUsers = () => async (dispatch) => {
    try {
        dispatch({ type: "FETCH_USERS_REQUEST" });

        const { data } = await axios.get("http://localhost:7000/api/users", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: "USERS_FETCHED_SUCCESSFULLY", payload: data });
    } catch (error) {
        dispatch({ type: "UNABLE_TO_FETCH" });
    }
};

export const updateUser = (id, user) => async (dispatch) => {
    try {
        const { data } = await axios.put(`http://localhost:7000/api/users/${id}`, user, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: "UPDATE_USER_SUCCESS", payload: data });
    } catch (error) {
        dispatch({ type: "UPDATE_USER_FAILURE", payload: error.message });
    }
};
