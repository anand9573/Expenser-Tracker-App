const express=require('express');
const router=express.Router();

const expenseController=require('../controllers/expense')

const userauthentication=require('../middleware/authenticate')

router.post('/add-expense',userauthentication.authenticate,expenseController.postExpense)

router.get('/get-expenses',userauthentication.authenticate,expenseController.getExpenses)

router.delete('/delete-expense/:id',userauthentication.authenticate,expenseController.deleteExpense)

router.get('/edit-expense',userauthentication.authenticate,expenseController.editExpense)


module.exports=router;