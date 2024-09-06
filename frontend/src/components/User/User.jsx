import { useDispatch } from "react-redux";
import { getUsers, updateUser } from "../../redux/actions/userActions";

const UserCard = ({ user }) => {
    const dispatch = useDispatch();

    return (
        <div className="user-card">
            <h4>{user.username}</h4>
            <img
                src="https://cdn-icons-png.flaticon.com/512/6048/6048190.png"
                onClick={() => {
                    dispatch(updateUser(user._id, { manager: null }));
                    dispatch(getUsers());
                }}
            />
        </div>
    );
};

export default UserCard;
