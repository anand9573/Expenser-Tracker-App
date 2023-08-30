const Razorpay=require('razorpay')
const Order=require('../model/orders');
const userController=require('./user')

exports.purchasepremium=async(req,res,next)=>{
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;
        rzp.orders.create({amount,currency:"INR"},async(err,order)=>{
            if(!err){
                await req.user.createOrder({orderid:order.id,status:'PENDING'});
                return res.status(201).json({order,key_id:rzp.key_id});
            }
            throw new Error('error with razorpay')
        })
    }catch(err){
        console.log(err)
        res.status(500).json({error:err})
    }
}

exports.updatetransactionstatus=async(req,res)=>{
    try{
        const userid=req.user.id
        const {payment_id,order_id}=req.body;
        const order=await Order.findOne({where:{orderid:order_id}})
        const promise1=order.update({paymentid:payment_id,status:'SUCCESSFUL'});
        const promise2=req.user.update({ispremiumuser:true});
        await Promise.all([promise1,promise2])
        res.status(202).json({success:true,message:'Transaction Successful',token:userController.generateAccessToken(userid,undefined,true)})
    }catch(err){
        res.status(403).json({error:err,message:'something went wrong'});
    }
}