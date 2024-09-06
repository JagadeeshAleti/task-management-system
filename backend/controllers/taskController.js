const { default: mongoose } = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
    console.log(`creating task, please wait................`);
    try {
        const task = new Task(req.body);
        await task.save();
        console.log("task created successfully..");
        res.status(201).send(task);
    } catch (err) {
        console.error("error while creating task", err.message);
        res.status(400).send(err.message);
    }
};

exports.getUserTasks = async (req, res) => {
    console.log("fetching tasks for the user........");
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
        console.log("tasks fetched successfully.");
        res.status(200).json(tasks);
    } catch(err) {
        console.error("error while fetching the tasks", err.message);
        res.status(400).send(err.message);
    }
}

exports.updateTask = async (req, res) => {
    console.log("updating task, please wait........");
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).send('Task not found');
        console.log("task updated successfully.");
        res.send(task);
    } catch (err) {
        console.error("error while updating the task", err.message);
        res.status(400).send(err.message);
    }
};

exports.deleteTask = async (req, res) => {
    console.log('deleting task, please wait...........');
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).send('Task not found');
        console.log('task deleted successfully.');
        res.status(200).send('Task deleted');
    } catch (err) {
        console.error('error while deleting the task', err.message);
        res.status(400).send(err.message);
    }
};
