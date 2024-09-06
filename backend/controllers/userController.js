const User = require("../models/User");

exports.getUsers = async (req, res) => {
    console.log("fetching users, please wait..............");
    try {
        const users = await User.find({}, { password: 0 });
        console.log("users fetched successfully.")
        res.status(200).send(users);
    } catch (err) {
        console.error("error while fething users", err.message);
        res.status(500).send(err.message);
    }
};

exports.updateUser = async (req, res) => {
    console.log("updating user, please wait........");
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        console.log("user updated successfully.");
        res.status(200).send(user);
    } catch (err) {
        console.error("error while updating the user", err.message);
        res.status(400).send(err.message);
    }
};
