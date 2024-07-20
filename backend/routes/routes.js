const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Auth routes
router.post('/signup', controller.signup);
router.post('/', controller.login);
router.get('/getBu',controller.getBu);
router.get('/getAllocatedSetsAdmin',controller.getAllocatedSetsAdmin);
router.get('/getSeatingCapacityAdmin',controller.getSeatingCapacityAdmin);
router.post('/createSeatingCapacityAdmin',controller.postSeatingCapacityAdmin);
router.put('/updateSeatingCapacityAdmin/:id',controller.updateSeatingCapacityAdmin);
router.delete('/deleteSeatingCapacityAdmin/:id',controller.deleteSeatingCapacityAdmin);
router.post('/createAllocatedSetsAdmin',controller.createAllocatedSetsAdmin);
router.get('/getSeatingCapacityAdminByFilter',controller.getSeatingCapacityAdminByFilter);
module.exports = router;
