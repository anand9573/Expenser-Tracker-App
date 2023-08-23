const express=require('express');
const router=express.Router();

const expenseController=require('../controllers/expense')

const userauthentication=require('../middleware/authenticate')

router.post('/add-expense',userauthentication.authenticate,expenseController.postExpense)

router.get('/get-expenses',userauthentication.authenticate,expenseController.getExpenses)

router.delete('/delete-expense/:id',userauthentication.authenticate,expenseController.deleteExpense)

router.put('/edit-expense/:id',expenseController.editExpense)


module.exports=router;