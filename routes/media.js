const express = require('express');
const router = express.Router();
const upload=require('../middileare/multermiddileware')
const middileare=require('../middileare/authentication')
const mediacontroller=require('../controllers/mediacontroller');
router.post('/uploadmedia',middileare.verify,upload.single('mediaFile'),mediacontroller.uploadmedia);
module.exports=router;