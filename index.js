const express=require('express');
const path=require('path');
const app=express();
const port=8005;
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const Blog=require('./models/blog');
require('dotenv').config(); 
const { checkforAuth } = require('./middlewares/auth');

const userRoutes=require('./routes/user');
const blogRoutes=require('./routes/blog');
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/blogify').then(e=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    console.log("Error connecting to MongoDB",err);
});

app.use(express.urlencoded({extended:false}));
app.use(express.json());    
app.use(checkforAuth('token'));
app.use(express.static(path.resolve('./public')));

app.set ('view engine','ejs');
app.set('views',path.resolve('./views'));

app.get('/',async (req,res)=>{
    const blogs=await Blog.find({}).sort('createdAt').populate('createdBy');
    res.render('home',{
        user:req.user,
        blogs:blogs,
    });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

app.use('/users',userRoutes);
app.use('/blogs',blogRoutes);