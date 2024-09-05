const express = require('express');
const { createTask, updateTask, deleteTask, getUserTasks } = require('../controllers/taskController');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authorizeRole(['admin', 'manager']), createTask);
router.put('/:id', authorizeRole(['admin', 'manager']), updateTask);
router.delete('/:id', authorizeRole(['admin', 'manager']), deleteTask);
router.get('/:id', authorizeRole(['admin', 'manager', 'user']), getUserTasks);

module.exports = router;
