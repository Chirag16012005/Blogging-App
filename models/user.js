const {Schema, model}=require("mongoose");
const bcrypt=require('bcrypt');
const { createToken } = require("../services/authentication");

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String,
        default:'/images/default.png'
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
},{timestamps:true});

userSchema.statics.isValidPasswordandcreateToken=async function(password,hashedPassword){
    return await bcrypt.compare(password,hashedPassword);
}

userSchema.pre('save',async function(next){

    if(!this.isModified('password'))
        return;
    try{
    if(this.isModified('password'))
    {
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
    }
}catch(err){
 next(err);
}
});

module.exports=model('User',userSchema);
