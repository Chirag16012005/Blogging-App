const express=require('express');
const path=require('path');
const app=express();
const port=8005;
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/blogify').then(e=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    console.log("Error connecting to MongoDB",err);
});
const userRoutes=require('./routes/user');
const { checkforAuth } = require('./middlewares/auth');

app.use(express.urlencoded({extended:false}));
app.use(express.json());    


app.set ('view engine','ejs');
app.set('views',path.resolve('./views'));

app.use(checkforAuth('token'));
app.get('/',(req,res)=>{
    res.render('home',{
        user:req.user
    });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

app.use('/users',userRoutes);