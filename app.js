const path=require('path');
// const fs=require('fs');
const express=require('express');

const dotenv=require('dotenv');

dotenv.config();

// const helmet=require('helmet');
// const morgan=require('morgan')

const bodyParser=require('body-parser');

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumFeatureRoutes=require('./routes/premiumFeatures')
const resetpasswordRoutes=require('./routes/password')

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/orders');
const forgotpassword=require('./model/forgotpassword');
const filesDownloaded=require('./model/filesdownloaded')

const userController=require('./controllers/user');

const cors=require('cors');
const app=express();

// const AccessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// app.use(morgan('combined', { stream: AccessLogStream }));

// app.use(helmet.contentSecurityPolicy({
//     directives: {
//       'script-src': ["'self'", "cdnjs.cloudflare.com"],
//     },
//   }));
app.use(bodyParser.json({extended:false}));

app.use(cors())

app.use(express.static(path.join(__dirname,'/public')));
app.use(express.static(path.join(__dirname,'/views')));

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumFeatureRoutes);
app.use('/password',resetpasswordRoutes);

app.use((req,res)=>{
res.sendFile(path.join(__dirname,`public/${req.url}`))
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(forgotpassword);
forgotpassword.belongsTo(User);

User.hasMany(filesDownloaded);
filesDownloaded.belongsTo(User);

userController.sync();

app.listen(3000);
