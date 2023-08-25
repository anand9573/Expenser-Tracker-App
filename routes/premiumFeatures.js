const express=require('express');

const premiumFeatureController=require('../controllers/premiumFeatures');

const authenticatemiddleware=require('../middleware/authenticate')

const router=express.Router();

router.get('/showLeaderBoard',authenticatemiddleware.authenticate,premiumFeatureController.getUserLeaderboard);

module.exports=router;