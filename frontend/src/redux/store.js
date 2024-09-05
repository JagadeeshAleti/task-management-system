import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import taskReducer from './reducers/taskReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
        users: userReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

export default store;
