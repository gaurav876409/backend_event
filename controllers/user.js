const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const validRegistrationData = require("../validation/register.js");
const jwtSecretKey = "myjwtsecretkey";
const logger = require("../utils/logger.js");
const registerUser = async(req, res) => {
    const err = validRegistrationData(req.body);
    if(err.hasError){
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
    const userDetails = {
        name: req.body.name,
        email: req.body.email
    };
    const plainTextPassword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
    userDetails.password = hashedPassword;
        const user = new User(userDetails);
        await user.save();
    res.json({
        success: true
    })
}

const loginUser = async(req, res) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    const user = await User.findOne({
        email: email
    });
    if(!user){
        return res.status(400).json({
            success: false,
            message: "user does not exit please register first"
        })
    }
    console.log(user)
    const isPasswordValid = await bcrypt.compare(plainTextPassword, user.password);
    if(!isPasswordValid){
        logger.info("login failure", {timestamp: new Date(), reason: "wrong password for"+ email})
        return res.status(400).json({
            success: false,
            message: "incorrect username and password"
        })
    }
    console.log(isPasswordValid);


    logger.info("login successfull", {timestamp: new Date(), email: user.email})

    const payload = {
        exp: Math.floor((Date.now() / 1000) + 3600),
        email: user.email,
        _id: user._id
    };
    const token = jwt.sign(payload, jwtSecretKey);
    await User.findByIdAndUpdate(user._id, {token: token});

    res.json({
        success: true,
        token: token
    })
}

const logoutUser = async (req, res) => {
    const decodedToken = jwt.decode(req.headers.authorization);
    const user = await User.findByIdAndUpdate(decodedToken._id, {token: ""});
    console.log(user)
    logger.info("logout Successfully", { timestamp: new Date(), reason: "logout successfull for"+decodedToken.email})
    res.json({
        success: true,
        message: "user logout successfully"
    })
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser
}