const {Router }= require('express');
const User=require('../models/user');
const { createToken } = require('../services/authentication');

const router=Router();

router.get("/signin",(req,res)=>{
    return res.render("signin");
})

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.post("/signup",async (req,res)=>{
  const {fullName,email,password}=req.body;
  await User.create({
    fullName,
    email,
    password
});
return res.redirect("/");
});

router.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).send("User not found");
    }
    const isValid=await User.isValidPasswordandcreateToken(password,user.password);
    console.log(isValid)
    if(!isValid)
        return res.status(400).render("signin",{
            error:"Invalid credentials. Try Again"
    });
    
    const token=createToken(user);
    console.log("Generated Token:",token);
    return res.cookie("token", token).redirect("/");
});
module.exports=router;