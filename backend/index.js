const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require('dotenv').config();
const adminAuth = require('./middleware/adminAuth');
const adminRoutes = require('./routes/admin');

app.use(express.json());
app.use(cors());

//Accessing the environmental variables
const dbHost = process.env.DB_HOST;
const dbSecretKey = process.env.DB_SECRET_KEY;
const cloudUrl = process.env.CLOUD_BASE_URL;

//Database Connection With MongoDB
mongoose.connect(`${dbHost}`);

//API Creation

app.use('/api', adminRoutes);


app.get("/",(req,res) => {
    res.send("Express App is Running")
})

//Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating Upload Endpoint For Images

app.use('/images',express.static(path.join(__dirname, 'upload/images')))

app.post("/upload", adminAuth, upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`${cloudUrl}/images/${req.file.filename}`
    })
})

//Schema For Creating Products

const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
})

app.post('/addproduct', adminAuth, async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0]; //because there is only one product so we can access it using [0] 
        id = last_product.id+1 // if last product is 2 the new id given to new product will be 2+1=3
    }else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    await product.save();
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating API For Deleting Products

app.post('/removeproduct', adminAuth, async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating API For Getting All Products

app.get('/allproducts', async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

//Schema Creating For User Model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

//Creating Endpoint For Registering The User
app.post('/signup',async (req,res) => {
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Existing User Found With Same Email Address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();
    
    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,`${dbSecretKey}`);
    res.json({success:true,token})
})

//creating endpoint for  user login

app.post('/login', async (req,res) => {
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,`${dbSecretKey}`);
            res.json({success:true,token});
        }else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }else{
        res.json({success:false,errors:"Wrong Email Id"});
    }
})


//creating endpoint for new collection data
app.get('/newcollections',async (req,res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

//creating endpoint for popular in women section
app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//creating middleware to fetch the user
    const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else{
            try{
                const data = jwt.verify(token,`${dbSecretKey}`);
                req.user = data.user;
                next();
            } catch (error) {
                res.status(401).send({errors:"please authenticate using a valid token"})
            }
        }
    }

//creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async (req,res) =>{
    console.log("added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});//this is id is mongoDb user object id
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ success: true, message: "Added to cart" });
})

//creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});//this is id is mongoDb user object id
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ success: true, message: "Removed from cart" });
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser, async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


const PORT = process.env.PORT || 4000;

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server Running on port ${PORT}`);
    } else {
        console.log("Error: " + error);
    }
});