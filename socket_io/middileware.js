const User=require('../models/user');
const jwt = require('jsonwebtoken');
module.exports=(io)=>{
io.use(async (socket, next) => {
    try{
            const token = socket.handshake.auth.token;
            if(!token){
                return next(new Error('Authentication error'));
            }
            const decode=jwt.verify(token,"kavyadivya");
            if(!decode){
                return next(new Error('invalide token or expired'));
            }
            const user=await User.findByPk(decode.id);
            if(!user){
                return next(new Error('user not found'));
            }
            console.log('sender user info to socket:',user);
            socket.user=user;
            next();
    }

    // Here you would normally verify the token and extract user info
    catch(err){
        console.error('Socket authentication error:', err);
        next(new Error('internal server error'));
    }
});
}