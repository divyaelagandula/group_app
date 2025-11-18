const express = require('express');
const router = express.Router();
const middleware=require('../middileare/authentication')
const groupcontroller=require('../controllers/groupcontroller');
router.post('/message',middleware.verify,groupcontroller.message);
router.get('/getmessages/:roomName',middleware.verify,groupcontroller.getmessages);
router.post('/checkingEmailExistsOrNot',middleware.verify,groupcontroller.checkingEmailExistsOrNot)
module.exports=router;