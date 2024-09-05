const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { username, password, role, manager } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role, manager });
        await user.save();
        res.status(201).send('User created');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
        res.json({ token });
    } catch (err) {
        res.status(500).send(err.message);
    }
};
