const express = require('express');
const router = express.Router();
const middleware=require('../middileare/authentication')
const groupcontroller=require('../controllers/groupcontroller');
router.post('/message',middleware.verify,groupcontroller.message);

module.exports=router;