const express=require('express');
const errorMiddleware=require('./middleware/error')
const app=express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const path=require('path')

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({limit: 52428800,extended: true}))
app.use(fileUpload())
app.use(express.json({ limit: "50mb" }));

//config
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config({path:'backend/config/config.env'})
}

//Route imports
const product=require('./routes/productRoute');
const user=require('./routes/userRoute');
const order=require('./routes/orderRoute');
const payment=require('./routes/paymentRoute');

app.use('/api/v1',product);
app.use('/api/v1',user)
app.use('/api/v1',order)
app.use('/api/v1',payment)

app.use(express.static(path.join(__dirname, '../frontend/build')))

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });

//Middleware for error Handling
app.use(errorMiddleware)

module.exports=app;