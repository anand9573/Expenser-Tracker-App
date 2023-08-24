const Razorpay=require('razorpay')
const Order=require('../model/orders');

exports.purchasepremium=async(req,res,next)=>{
    try{
        var rzp = new Razorpay({
            key_id: 'rzp_test_1elumNyVf2lFRS',
            key_secret: 'cGEOoJOm8W3RKKkjNx9zIKB9'
        })
        const amount=2500;
        rzp.orders.create({amount,currency:"INR"},async(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            await req.user.createOrder({orderid:order.id,status:'PENDING'});
            res.status(201).json({order,key_id:rzp.key_id});
        })
    }catch(err){
        console.log(err)
        res.status(500).json({error:err})
    }
}

exports.updatetransactionstatus=async(req,res)=>{
    try{
        const {payment_id,order_id}=req.body;
        const order=await Order.findOne({where:{orderid:order_id}})
        const promise1=await order.update({paymentid:payment_id,status:'SUCCESSFUL'});
        const promise2=await req.user.update({ispremiumuser:true});
        await Promise.all([promise1,promise2])
        res.status(202).json({success:true,message:'Transaction Successful',ispremiumuser:true})
    }catch(err){
        const order=await Order.findOne({where:{orderid:order_id}})
        await order.update({paymentid:payment_id,status:'FAILED'})
        console.log(err)
        res.status(403).json({error:err,message:'something went wrong',ispremiumuser:false})
    }
}