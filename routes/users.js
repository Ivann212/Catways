const express = require('express');
const { setUsers, getUsers, editUser, createAdmin } = require('../controller/user.controller');
const { deleteUser } = require('../controller/dashboard.controller');
const router = express.Router();


router.get("/",getUsers);
router.post('/', setUsers);
router.delete('/:id', deleteUser);
router.put('/:id', editUser);
router.post('/create-admin', createAdmin);




module.exports = router