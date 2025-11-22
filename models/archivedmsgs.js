const { DataTypes } = require('sequelize');
const db = require('../utils/dbconncetion'); // Assuming this connects to your database instance

const ArchivedChat = db.define('ArchivedChat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    roomName: { // Corresponds to recipientId in the previous conceptual explanation
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    },

    // --- Media Fields ---
    mediaUrl: {
        type: DataTypes.STRING(2048),
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

    // Timestamp field (Crucial for Archival and Querying)
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    
    // You should also include fields for the sender (e.g., senderId) 
    // if your 'group' model has it defined implicitly or explicitly.
    // For this example, I'll assume it's part of your association setup.

})
module.exports = ArchivedChat;