const path=require('path');

const express=require('express');

const bodyParser=require('body-parser');

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumFeatureRoutes=require('./routes/premiumFeatures')
const passwordRoutes=require('./routes/password')

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/orders');

const userController=require('./controllers/user');

const cors=require('cors');
const app=express();

const dotenv=require('dotenv');

dotenv.config();

app.use(bodyParser.json({extended:false}));

app.use(cors())

app.use(express.static(path.join(__dirname,'/public')));
app.use(express.static(path.join(__dirname,'/views')));

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumFeatureRoutes);
app.use('/password',passwordRoutes)

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

userController.sync();

app.listen(3000);
