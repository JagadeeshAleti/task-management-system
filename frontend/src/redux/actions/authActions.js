import axios from 'axios';

export const login = (credentials) => async (dispatch) => {
    try {
        const { data } = await axios.post('http://localhost:7000/api/auth/login', credentials);
        localStorage.setItem('token', data.token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.token });
    } catch (error) {
        dispatch({ type: 'LOGIN_FAILURE' });
    }
};

export const register = (user) => async (dispatch) => {
    try {
        const { data } = await axios.post('http://localhost:7000/api/auth/register', user);
        localStorage.setItem('token', data.token);
        dispatch({ type: 'REGISTER_SUCCESS', payload: data.token });
    } catch (error) {
        dispatch({ type: 'REGISTER_FAILURE' });
    }
};
