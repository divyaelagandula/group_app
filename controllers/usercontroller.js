const usermodel=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const signup=async (req,res)=>{
    try{
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password=hashedPassword;
        const response=await usermodel.create(req.body);
        res.status(201).json({message:'User registered successfully',data:response});
    }
    catch(err){
        console.log(err);
        if(err.name==='SequelizeUniqueConstraintError'){
            return res.status(400).json({message:'Email already exists'});
        }

        res.status(500).json({message:'Error registering user',error:err.message});
    }

}
function generateToken(userId){
    return jwt.sign({id:userId},"kavyadivya")
}
const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await usermodel.findOne({where:{email:email}});
        if(!user){
            return  res.status(404).json({message:'User not found'});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid password'});
        }
        res.status(200).json({message:'Login successful',data:user,token:generateToken(user.id)});
    }
    catch(err){
        res.status(500).json({message:'Error logging in',error:err.message});
    }
}
const saverooms=async (req,res)=>{
   // 1. Get the authenticated user ID from the middleware
    // Note: If you use Sequelize with auto-increment IDs, this is likely req.user.id
    const userId = req.user.id; 
    
    // 2. Get the new list of rooms (the array) from the frontend payload
    const { rooms } = req.body; 

    // Basic validation
    if (!rooms || !Array.isArray(rooms)) {
        return res.status(400).json({ success: false, message: 'Invalid rooms data provided (must be an array).' });
    }

    try {
        // 3. Update the user's record. 
        // Sequelize automatically handles converting the JavaScript array 'rooms' 
        // into the MySQL JSON string format when updating the JSON column.
        const [rowsUpdated] = await usermodel.update(
            { joinedRooms: rooms },
            { 
                where: { id: userId } 
            }
        );

        if (rowsUpdated === 0) {
            return res.status(404).json({ success: false, message: 'User not found or rooms already up-to-date.' });
        }

        // 4. Send success response
        res.status(200).json({ 
            success: true, 
            message: 'Joined rooms successfully updated.'
        });

    } catch (error) {
        console.error('Error saving rooms:', error);
        res.status(500).json({ success: false, message: 'Internal server error while updating rooms.' });
    }
}
// userController.js (continued)

// --- Controller Function for Getting Rooms ---
const getJoinedRooms = async (req, res) => {
    const userId = req.user.id; 

    try {
        // 1. Find the user and select only the joinedRooms field.
        const user = await usermodel.findByPk(userId, {
            attributes: ['joinedRooms']
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // 2. Sequelize/MySQL JSON column retrieves the data as a JavaScript object/array.
        const rooms = user.joinedRooms || []; 

        // 3. Return the array
        res.status(200).json({ 
            success: true, 
            rooms: rooms
        });

    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ success: false, message: 'Internal server error while fetching rooms.' });
    }
};
module.exports={
    signup,
    login,
    saverooms,
    getJoinedRooms
}