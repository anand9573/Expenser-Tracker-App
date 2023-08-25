const jwt=require('jsonwebtoken');
const User=require('../model/user');

exports.authenticate=async (req,res,next)=>{
    try{
        const token=req.header('Authorization');
        const user=jwt.verify(token,process.env.TOKEN_SECRET);
        console.log(user.userid);
        const authorized=await User.findByPk(user.userid)
        if(authorized){
            console.log(JSON.stringify(authorized));
            req.user=authorized;
            next();
        }else{
            throw new Error({err:'User not exist'});
        }
    }catch(err){
        console.log(err);
        res.status(401).json({success:false,err});
    }
}