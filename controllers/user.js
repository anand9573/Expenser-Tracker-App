const user=require('../model/user');

const sequelize = require('../util/database');

function isInValid(string){
    if(string==undefined || string.length===0){
        return true
    }else{
        return false
    }
}

exports.signup=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body;
        if(isInValid(name) || isInValid(email) || isInValid(password)){
            throw new Error('Fill all details.You missed some details')
        }else{
            const emailExists = await user.findOne({ where: { email: email } });
            if (emailExists){
                res.status(200).json("Email already registered");
            }else{
                const data=await user.create({name:name,email:email,password:password})
                res.status(201).json({userDetails:data})
            }
}
    }catch(err){
        res.status(500).json({error:err})
    }
}

exports.login=async(req,res,next)=>{
    try{
        const {email,password}=req.body
        const emailExists = await user.findOne({ where: { email: email } });
        if(emailExists){
            if(emailExists.password===password){
                res.status(201).json({message:'user login successfully'})
            }else if(emailExists.password!==password){
                throw new Error(' * Incorrect Password')
            }
        }else{
            throw new Error(' * User Not Found. Check the details !')
        }
    }catch(err){
        console.log(err.message)
        res.status(500).json({message:err.message})
    }
}

exports.sync=async()=>{
    try{
        await sequelize.sync()
    }catch(err){
        console.log(err)
    }
}