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
