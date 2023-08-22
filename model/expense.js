const Sequelize = require('sequelize');
const sequelize=require('../util/database');

const expenses=sequelize.define('expenses',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    expenseAmount:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    }
});

module.exports=expenses;