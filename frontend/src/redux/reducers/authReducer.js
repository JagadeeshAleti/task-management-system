const initialState = { token: localStorage.getItem('token'), error: null };

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return { ...state, token: action.payload, error: null };
        case "LOGIN_FAILURE":
            return { ...state, error: "Invalid Credentials" };
        case "REGISTER_SUCCESS":
            return { ...state, token: action.payload, error: null };
        case "REGISTER_FAILURE":
            return { ...state, error: "Please check the username and password"};
        default:
            return state;
    }
};

export default authReducer;
