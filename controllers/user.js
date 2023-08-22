const user=require('../model/user');

const bcrypt=require('bcrypt')

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
            return res.status(400).json({err:'Make sure fill all the details'})
        }else{
            const emailExists = await user.findOne({ where: { email: email } });
            if (emailExists){
                res.status(200).json("Email already registered");
            }else{
                const saltrounds=10;
                bcrypt.hash(password,saltrounds,async(err,hash)=>{
                    console.log(err)
                    await user.create({name,email,password:hash})
                    res.status(201).json({message:'user created successfully'})
                })
            }
}
    }catch(err){
        res.status(500).json({error:err})
    }
}

exports.login=async(req,res,next)=>{
    try{
        const {email,password}=req.body
        if(isInValid(email) || isInValid(password)){
            return res.status(400).json({message:'Email or password is missing',success:false})
        }
        const emailExists = await user.findOne({ where: { email: email } });
        if(emailExists){
            bcrypt.compare(password,emailExists.password,(err,result)=>{
                if(err){
                    throw new Error('something went wrong');
                }if(result===true){
                    res.status(201).json({success:true,message:'User logged in successfully'})
                }
                else{
                    res.status(400).json({success:false,message:' * Password is inCorrect'})
                }
            })
        }else{
            res.status(404).json({success:false,message:'* User Not Exist!'})
        }
    }catch(err){
        res.status(500).json({success:false,message:err})
    }
}

exports.sync=async()=>{
    try{
        await sequelize.sync()
    }catch(err){
        console.log(err)
    }
}