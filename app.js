const path=require('path');

const express=require('express');

const bodyParser=require('body-parser');

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const sequelize = require('./util/database');

const userController=require('./controllers/user');

const cors=require('cors');
const app=express();

app.use(bodyParser.json({extended:false}));

app.use(cors())

app.use(express.static(path.join(__dirname,'/public')));
app.use(express.static(path.join(__dirname,'/views')));

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes)

userController.sync();

app.listen(3000);
