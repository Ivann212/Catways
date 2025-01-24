const express = require('express');
const { getCatways, setCatways, deleteCatway, editCatway, viewCatway } = require('../controller/catway.controller');
const { isAdmin } = require('../middleware/auth');
const router = express.Router();


router.get("/",getCatways);
router.get('/:id', viewCatway);
router.post('/', setCatways);
router.delete('/:id',isAdmin, deleteCatway);
router.post('/:id',isAdmin, editCatway);



module.exports = router
