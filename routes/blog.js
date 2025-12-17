const {Router}=require('express');
const Blog=require('../models/blog');
const {checkforAuth}=require('../middlewares/auth');
const router=Router();
const multer=require('multer');
const path=require('path');
const Comment=require('../models/comment');

const storage=multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,path.resolve(`./public/uploads`) );
    },
    filename:function(req,file,cb)
    {
        const filename=`${Date.now()}-${file.originalname}`;
        cb(null, filename);
    },
});
const upload=multer({storage:storage});

router.get("/add-new",(req,res)=>{
    return res.render("addblog",{
        user:req.user,
    });
})

router.post("/",upload.single('coverImage'),checkforAuth('token'),async (req,res)=>{
    if(!req.user){
        return res.status(401).send("Unauthorized");
    }
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).render("addblog", {
            user: req.user,
            error: "Blog title is required."
        });
    }
    const blog = await Blog.create({
        title: req.body.title,
        body: req.body.body,
        coverImageUrl: req.file ? `/uploads/${req.file.filename}` : null,
        createdBy: req.user._id,
    });
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    return res.redirect(`/blogs/${blog._id}`);
});

router.get("/:blogId",async (req,res)=>{
    const blogId=req.params.blogId;
    const blog=await Blog.findById(blogId);
    const comments=await Comment.find({blogId:blogId}).populate('createdBy');
    blog.comments=comments;

    return res.render("blog",{
        blog: blog,
        user: req.user,
        comments:comments,
    });
});

router.post("/comment/:blogId",async (req,res)=>{
        await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id,
    });
    return res.redirect(`/blogs/${req.params.blogId}`);
});
module.exports=router;