const express = require('express');
const router = express.Router();
const usercontroller=require('../controllers/usercontroller');
const middileware=require('../middileare/authentication')
router.post('/signup',usercontroller.signup);
router.post('/login',usercontroller.login);
router.post('/saverooms',middileware.verify,usercontroller.saverooms)
router.get('/getrooms',middileware.verify,usercontroller.getJoinedRooms)
module.exports=router;