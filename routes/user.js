const express=require('express');
const router=express.Router();

const userController=require('../controllers/user');

const expenseController=require('../controllers/expense');

const authenticatemiddleware=require('../middleware/authenticate')

router.post('/sign-up',userController.signup)

router.post('/login',userController.login)

router.get('/download',authenticatemiddleware.authenticate,expenseController.downloadexpense);


module.exports=router;