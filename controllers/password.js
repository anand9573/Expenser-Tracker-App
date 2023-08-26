const Sib=require('sib-api-v3-sdk');
exports.resetpassword=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const client=Sib.ApiClient.instance
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey='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';
const tranEmailApi=new Sib.TransactionalEmailsApi();
const sender={
    email:'anandbukyanaik9573@gmail.com'
}
const receivers=[
    {
    email:req.body.email
    },
]
        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject:'Reset Password',
            htmlContent:`<h1>Expense Tracker App</h1><p>Here is the otp {{params.role}} to reset your password valid for only 10 minutes</p><a href="http://127.0.0.1:5501/views/forgotpassword.html">Reset Password</a>`,
            params:{
                role:Math.trunc(Math.random() * (1000000 - 1111 + 1) + 1111)
            }
        })
        console.log('sent')
    }catch(err){
        console.log(err,'failed to sent')
    }
}