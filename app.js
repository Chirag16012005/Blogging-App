const express=require('express');
const path=require('path');
const app=express();
const port=process.env.PORT || 8005;
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const Blog=require('./models/blog');
require('dotenv').config(); 
const { checkforAuth } = require('./middlewares/auth');

const userRoutes=require('./routes/user');
const blogRoutes=require('./routes/blog');
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL).then(e=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    console.log("Error connecting to MongoDB",err);
});


app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(checkforAuth('token'));

// Set res.locals.user for all views
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

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


app.use('/users',userRoutes);
app.use('/blogs',blogRoutes);

// 404 handler
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    // Hide stack trace and sensitive info in production
    res.status(500).render('404', { error: 'Something went wrong. Please try again later.' });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});