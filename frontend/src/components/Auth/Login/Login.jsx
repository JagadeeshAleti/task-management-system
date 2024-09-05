import "./styles.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/actions/authActions";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            navigate("/tasks");
        }
    }, [token, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ username, password }));
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Login</button>
            </form>
            <div className="register-link">
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
