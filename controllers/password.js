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
                htmlContent:`<h1>Expense Tracker App</h1><p>Hi there! Reset the Expense Tracker APP password for your account with email</p><a href="http://51.20.27.97/password/resetpassword/{{params.role}}">Reset Password</a><hr><hr><p>If reset password is not requested by you then contact us Immediately at dummy@gmail.com</p>`,
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
                // app.get('/redirect', function(req, res) {
                //     const id = req.query.id;
                //     res.redirect(`http://someurl/resetpassword.html/?id=${id}`);
                //   });
                res.status(200).send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset password</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
                    <link rel="stylesheet" href="http://51.20.27.97/css/main.css">
                <body >
                    <div class="container p-2">
                        <div class="card-body w-50 m-auto">
                            <h3 class="text-white text-center p-1">Expense Tracker App</h3>
                            <form action="http://51.20.27.97/password/updatepassword/${id}" onsubmit="formsubmitted(e)" method="get" class="form-control bg-dark text-white mb-2">
                                <h5 class="h4 rounded text-center ">Reset Password</h5>
                                <label for="newpassword" class="form-label">Enter New password</label>
                                <input name="newpassword" type="password" id="newpassword" class="form-control bg-light text-success fw-bold mb-3" required></input>
                                <button class="form-control fw-bold text-center" type="submit" id="submit">Change Password</button>
                                </form>
                            </form>
                            <ul class="text-center border-0 p-0 m-1">
                                <li style="list-style-type: none;margin-bottom: 3px;"><a href="http://51.20.27.97/user/signup.html">New User-Sign Up</a></li>
                                <li style="list-style-type: none;"><a href="http://51.20.27.97/user/login.html">Exisiting User-Login</a></li>
                            </ul>
                        </div>
                    </div>
                    <script>
                    function formsubmitted(e){
                        e.preventDefault();
                        const submit=document.getElementById('submit')
            const h5=document.createElement('h5')
            h5.textContent+="Your Password is Changed Successfully"
            h5.style.color='green';
            submit.before(h5)
            }
                    </script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js"></script>
                </body>
                </html>`);
                res.end();
                
            }
    }catch(err){
        res.status(500).json({ message: err, success: false });
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
                                res.status(200).send('<h2>Password Changed Successfully</h2>');
                            })
                        });
                    };
        }
        catch(error){
        res.status(500).json({ message:'Something went wrong', success: false } )
        }
    }