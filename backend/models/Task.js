const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["low", "medium", "high"] },
    deadline: { type: Date },
    completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);
