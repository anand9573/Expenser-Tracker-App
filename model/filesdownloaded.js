const Sequelize=require('sequelize');
const sequelize=require('../util/database')

const filesDownloaded=sequelize.define('filesdownloaded',{
id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    allowNull:false,
},
fileurl:Sequelize.STRING,
});

module.exports=filesDownloaded;