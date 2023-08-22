const express=require('express');
const router=express.Router();

const userController=require('../controllers/user')

router.post('/sign-up',userController.signup)

router.post('/login',userController.login)


module.exports=router;