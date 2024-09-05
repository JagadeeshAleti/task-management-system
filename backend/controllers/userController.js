const User = require("../models/User");

exports.getUsers = async (req, res) => {
    console.log("Fetching userss..............");
    try {
        const users = await User.find({}, { password: 0 });
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
};
