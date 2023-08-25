const express=require('express');
const router=express.Router();

const purchaseController=require('../controllers/purchase');

const authenticatemiddleware=require('../middleware/authenticate')

router.get('/premiummembership',authenticatemiddleware.authenticate,purchaseController.purchasepremium);

router.post('/updatetransactionstatus',authenticatemiddleware.authenticate,purchaseController.updatetransactionstatus)

module.exports=router;