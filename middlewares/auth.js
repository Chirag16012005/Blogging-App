const { verify } = require("jsonwebtoken");
const { verifyToken } = require("../services/authentication");

function checkforAuth(cookie) {
    return (req,res,next)=>{
        console.log(req.cookies);
        const token = req.cookies[cookie];
        console.log("Token from cookie:",token);
        if(!token){
            next();
        }
        try{
        const userPayload=verifyToken(token);
        req.user=userPayload;
        }
        catch(err){}
        next();
    }

};
module.exports = {checkforAuth};