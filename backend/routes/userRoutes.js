const express = require('express');
const { getUsers, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUsers);
router.put('/:id', updateUser);

module.exports = router;
