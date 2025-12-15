const JWT =require('jsonwebtoken');
dotenv=require('dotenv');
dotenv.config();

const JWT_SECRET=process.env.JWT_SECRET;

function createToken(user){
    const payload={
        _id:user._id,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role
    };

    const token=JWT.sign(payload,JWT_SECRET,{
        expiresIn:'1d'
    });
    return token;

}

function verifyToken(token){
    const payload=JWT.verify(token,JWT_SECRET);
    return payload;
};

module.exports={createToken,verifyToken};