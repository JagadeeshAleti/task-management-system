const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    console.log(`registering  user, please wait.............`);
    const { username, password, role, manager } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role, manager });
        await user.save();
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
        res.status(201).json({token});
        console.log(`user registered successfully!`)
    } catch (err) {
        console.error(`user registration unsuccessful`, err.msg)
        res.status(400).send(err.message);
    }
};

exports.login = async (req, res) => {
    console.log(`user logging in, please wait.............`);
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret');
        res.status(200).json({ token });
        console.log(`user logged in successully!`)
    } catch (err) {
        console.log(`user logging failed`, err.message)
        res.status(500).send(err.message);
    }
};
