const initialState = { tasks: [], error: null };

const taskReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_TASK_SUCCESS":
            return { ...state, tasks: [...state.tasks, action.payload] };
        case "UPDATE_TASK_SUCCESS":
            return { ...state, tasks: [...state.tasks, action.payload] };
        case "DELETE_TASK_SUCCESS":
            return { ...state };
        case "GET_USER_TASKS": 
            return { ...state, tasks: action.payload }        
        default:
            return state;
    }
};

export default taskReducer;
