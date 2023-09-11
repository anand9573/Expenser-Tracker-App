const path=require('path');

const express=require('express');

const dotenv=require('dotenv');

dotenv.config();

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

app.use(express.json());

app.use(cors())

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
