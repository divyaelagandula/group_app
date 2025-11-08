const {DataTypes,sequelize}=require('sequelize');
const db=require('../utils/dbconncetion');

const group=db.define('group',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    },
 
});

module.exports=group;