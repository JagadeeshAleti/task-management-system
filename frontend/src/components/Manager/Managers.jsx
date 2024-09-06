import UserCard from "../User/User";

const ManagerCard = ({ manager, onAddUserToManager }) => {
    return (
        <div className="manager-card">
            <h2>{manager.username}</h2>
            {!manager.users.length && (
                <div className="no-users">No Users, Click on Add Users to add</div>
            )}
            <div className="users-list">
                {manager.users.map((u) => (<UserCard key={u._id} user={u} />))}
            </div>
            <button className="submit" onClick={() => onAddUserToManager(manager._id)}>
                Add Users
            </button>
        </div>
    );
};

export default ManagerCard;
