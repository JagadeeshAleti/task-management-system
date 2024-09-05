const { default: mongoose } = require('mongoose');
const Task = require('../models/Task');

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
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const tasks = await Task.find({ assignedTo: userObjectId });
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
