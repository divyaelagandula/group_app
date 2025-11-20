const {DataTypes,sequelize}=require('sequelize');
const db=require('../utils/dbconncetion');
const { sign } = require('crypto');
const signup=db.define('user',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    joinedRooms: {
        type: DataTypes.JSON, // Use the JSON data type
        allowNull: true,
        defaultValue: [],
    }
});

module.exports=signup;