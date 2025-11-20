const {DataTypes,sequelize}=require('sequelize');
const db=require('../utils/dbconncetion');

const group=db.define('group',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    roomName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    message: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },

        // --- Fields for Media Messages (NULL for text messages) ---
        mediaUrl: {
            type: DataTypes.STRING(2048), // Allows for very long S3 URLs
            allowNull: true,
            defaultValue: null
        },
        mimeType: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null
        },
        
        // Timestamp fields (Sequelize handles createdAt/updatedAt by default)
        // If you need a specific 'timestamp' field as defined in your schema:
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,// Combined with roomName for ordering
        }
 
});

module.exports=group;