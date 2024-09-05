const { default: mongoose } = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.getUserTasks = async (req, res) => {
    console.log("Fetching tasks for the user........");
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        let tasks;
        if(req.user.role === "admin") {
            tasks = await Task.find({});
        }

        if(req.user.role === "user") {
            tasks = await Task.find({ assignedTo: userId});
        }

        if(req.user.role === "manager") {
            let usersUnderManager = await User.find({ manager: userId }, { _id: 1});
            const users = usersUnderManager.map(u => u._id);
            tasks = await Task.find({ assignedTo: { $in : [userId, ...users]}})
        }
        res.status(200).json(tasks);
    } catch(err) {
        res.status(400).send(err.message);
    }
}

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).send('Task not found');
        res.send(task);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).send('Task not found');
        res.send('Task deleted');
    } catch (err) {
        res.status(400).send(err.message);
    }
};
