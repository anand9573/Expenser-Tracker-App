const Sib=require('sib-api-v3-sdk');
// const sgMail = require('@sendgrid/mail');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../model/user');
const Forgotpassword = require('../model/forgotpassword');

exports.forgotpassword = async (req, res) => {
    try {
        const  email= req.params.email;
        const user = await User.findOne({ where: { email } });
        if (user) {
            const client=Sib.ApiClient.instance
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey=process.env.API_KEY
            const tranEmailApi=new Sib.TransactionalEmailsApi();
            const sender={
                email:'anandbukyanaik9573@gmail.com'
            }
            const receivers=[
                {
                email:req.params.email
                },
            ]
            const id = uuid.v4();
            await user.createForgotpassword({ id, active: true });
            await tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject:'Reset Password',
                htmlContent:`<h1>Expense Tracker App</h1><p>Hi there! Reset the Expense Tracker APP password for your account with email</p><a href="http://16.171.202.45/password/resetpassword/{{params.role}}">Reset Password</a><hr><hr><p>If reset password is not requested by you then contact us Immediately at dummy@gmail.com</p>`,
                params:{
                    role:id
                }
            })

            // await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

            // const msg = {
            //     to: email,
            //     from: 'anandbukyanaik9573@gmail.com',
            //     subject: 'Reset Password',
            //     text: 'Hi there! Reset the Expense Tracker APP password for your account with email',
            //     html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
            // };

            // sgMail.send(msg);

            // Sending a user-friendly response
            res.status(200).json({ message: 'Password reset link sent to your email', success: true });
        }
    } catch (err) {
        res.status(500).json({ message: 'Email not exist', success: false });
    }
};

exports.resetpassword = async(req, res) => {
    try{

        const id =  req.params.id;
        const forgotpasswordrequest=await Forgotpassword.findOne({ where : { id }})
            if(res){
                await forgotpasswordrequest.update({ active: false});
                res.redirect('http://16.171.202.45/resetpassword.html');
                res.status(200).json({success:true},{message:'Reset Password Link Sent Successfully'})
            }
    }catch(err){
        res.status(500).json({ message: 'link expired or not valid', success: false });
    }
    }

exports.updatepassword =async(req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        const resetpasswordrequest=await Forgotpassword.findOne({ where : { id: resetpasswordid }})
            const user=await User.findOne({where: { id : resetpasswordrequest.userId}})
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        bcrypt.hash(newpassword, salt, async(err, hash)=>{
                            await user.update({ password: hash })
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });
                    };
        }
        catch(error){
        res.status(500).json({ message:'Something went wrong', success: false } )
        }
    }