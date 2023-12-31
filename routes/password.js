const express=require('express');

const resetpasswordController=require('../controllers/password');

const router=express.Router();

router.get('/updatepassword/:resetpasswordid',resetpasswordController.updatepassword);

router.get('/resetpassword/:id',resetpasswordController.resetpassword)

router.get('/forgotpassword/:email',resetpasswordController.forgotpassword);

module.exports=router;