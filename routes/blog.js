const {Router}=require('express');
const Blog=require('../models/blog');
const {checkforAuth}=require('../middlewares/auth');
const router=Router();

router.get("/add-new",(req,res)=>{
    return res.render("addblog",{
        user:req.user,
    });
})


module.exports=router;