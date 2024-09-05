import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../redux/actions/authActions";
import { Link, useNavigate } from "react-router-dom"; 

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

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
        dispatch(register({ username, password, role }));
    };

    return (
        <div className="register-container">
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
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                </select>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Register</button>
            </form>
            <div className="login-link">
                <p>
                    Already have an account?{" "}
                    <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
