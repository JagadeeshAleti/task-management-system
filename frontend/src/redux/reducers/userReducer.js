const initialState = {
    users: [],
    loading: false,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "USERS_FETCHED_SUCCESSFULLY":
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: null,
            };
        case "UNABLE_TO_FETCH":
            return {
                ...state,
                loading: false,
                error: "Unable to fetch users",
            };
        case "FETCH_USERS_REQUEST":
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};

export default userReducer;
