const jwt = require('jsonwebtoken');
const jwtSecretKey = 'myjwtsecretkey';
const User = require('../models/user.js')

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(400).json({
            success: false,
            message: "token is required in headers"
        })
    }
    try{
        jwt.verify(token, jwtSecretKey);
    }catch (err){
        return res.status(400).json({
            success: false,
            message: "invalid jwt"
        });
    }

    const decodedToken = jwt.decode(token);
    const now = Math.floor(Date.now()/ 1000);
    if(now > decodedToken.exp){
        return res.status(400).json({
            success: false,
            message: "token expired please re login"
        });
    }

    const user = await User.findById(decodedToken._id);
    if(user.token !== token){
        return res.status(400).json({
            success: false,
            message: "invalid jwt"
        })
    }
    req.user = user;
    next();
}
module.exports = authMiddleware;