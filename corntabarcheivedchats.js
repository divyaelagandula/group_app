// archiveChatData.js
const { Op } = require('sequelize');
const db = require('./utils/dbconncetion'); // Adjust path to your connection file
const Group = require('./models/group'); // Adjust path to your Group model
const ArchivedChat = require('./models/archivedmsgs'); // Adjust path to your ArchivedChat model

// Assuming Group and ArchivedChat models are defined with the same structure
// and the timestamp field is named 'timestamp'.

async function runNightlyArchiving() {
    console.log(`[${new Date().toISOString()}] Starting nightly chat archiving...`);

    // 1. Calculate the cutoff date (1 day ago)
    const cutoffDate = new Date();
   // cutoffDate.setDate(cutoffDate.getDate() - 1); 
   // 🔑 CHANGE THIS LINE: Subtract 1 hour (60 minutes) from the current time
    cutoffDate.setMinutes(cutoffDate.getMinutes() - 5);

    // Convert to the format needed for the SQL query (e.g., YYYY-MM-DD HH:MM:SS)
    const cutoffDateISO = cutoffDate.toISOString().slice(0, 19).replace('T', ' ');

    const t = await db.transaction(); // Start an atomic transaction
    
    try {
        // --- Step 1: Data Migration (INSERT INTO...SELECT FROM) ---
        // Copy rows older than the cutoff date from 'groups to 'ArchivedChats'.
    // Add 'userId' to the list of columns
const insertQuery = `
    INSERT INTO ArchivedChats (
        roomName, message, mediaUrl, mimeType, filename, timestamp, createdAt, updatedAt, userId
    )
    SELECT 
        roomName, message, mediaUrl, mimeType, filename, timestamp, createdAt, updatedAt, userId
    FROM 
       \`groups\`
    WHERE 
        timestamp < :cutoffDate;
`;
        
        const insertResult = await db.query(insertQuery, {
            replacements: { cutoffDate: cutoffDateISO },
            type: db.QueryTypes.INSERT,
            transaction: t,
        });

        console.log(`- Successfully moved ${insertResult} rows to ArchivedChats.`);

        // --- Step 2: Data Deletion (DELETE) ---
        // Remove the migrated rows from the hot table.
        const deleteQuery = `
            DELETE FROM 
               \`groups\`
            WHERE 
                timestamp < :cutoffDate;
        `;

        const deleteCount= await db.query(deleteQuery, {
            replacements: { cutoffDate: cutoffDateISO },
            type: db.QueryTypes.DELETE,
            transaction: t,
        });

        console.log(`- Successfully deleted ${deleteCount} rows from groups.`);
        await t.commit();
        console.log('✅ Archiving completed successfully.');

    } catch (error) {
        // --- Step 4: Rollback on Error ---
        await t.rollback();
        console.error('❌ Archiving failed, transaction rolled back:', error);
    } 
}

// Execute the function
module.exports={
    runNightlyArchiving
}