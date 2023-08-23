const jwt=require('jsonwebtoken');
const User=require('../model/user');

exports.authenticate=async (req,res,next)=>{
    try{
        const token=req.header('Authorization');
        const user=jwt.verify(token,'6164611lmfgfdkgp2skdkfpad5kpf46496kepeopwemmckeiorepmkdflfell446pewfk8srkfpsps');
        console.log(user.userid);
        const authorized=await User.findByPk(user.userid)
        if(authorized){
            console.log(JSON.stringify(authorized));
            req.user=authorized;
            next();
        }else{
            throw new Error({err:'User not exist'})
        }
    }catch(err){
        console.log(err);
        res.status(401).json({success:false,err})
    }
}