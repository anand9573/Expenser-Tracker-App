const express=require('express');
const router=express.Router();

const passwordController=require('../controllers/password')

router.put('/forgotpassword',passwordController.resetpassword)


module.exports=router;