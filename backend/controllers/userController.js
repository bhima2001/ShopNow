const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require('../middleware/catchAsyncError')
const User=require('../models/userModel');
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto=require('crypto')
const Product=require('../models/productModel')
const cloudinary=require('cloudinary')

//Register a User

exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}=req.body
    console.log(req.body.avatar)
    const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:'avatars',
        width:150,
        crop:'scale',
        allowed_formats:['png','jpeg','jpg','webp']
    })
    console.log(myCloud)
    const user=await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.url,
        }
    })
    console.log(user,'hello')
    sendToken(user,201,res)
})


//login user

exports.loginUser=catchAsyncErrors(async (req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return next(new ErrorHandler('Please Enter email and password',400))
    }

    const user=await User.findOne({ email }).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid email or password',401));
    }

    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid password or email',401))
    }

    sendToken(user,200,res)
})


//Logout User

exports.logout = catchAsyncErrors(async (req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })


    res.status(200).json({
        success:true,
        message:"Logged True"
    })
})

exports.forgotPassword = catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('User not found',404));
    }
    console.log(user)
    //Get password token
    const resetToken=await user.passwordReset();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message=`Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email please ignore`
    console.log(message)
    try {
        console.log(user.email)
        await sendEmail({
            email:user.email,
            subject:'Ecommerce Password Recovery',
            message
        })
        console.log(1)
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500))
    }

})


exports.resetPassword=catchAsyncErrors(async (req,res,next)=>{
    //creating token hash
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return next(new ErrorHandler('ResetPasswordToken is invalid or expired ',400));
    }

    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler('Password and confirm password do not match',400));
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    sendToken(user,200,res);
})



//Get user details

exports.getUserDetails=catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.user.id)

    res.status(200).json({
        success:true,
        user
    })
})


//Update Password
exports.updatePassword=catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');
    console.log(user)
    const isPasswordMatched=await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched){
        return next(new ErrorHandler('old password is wrong',404));
    }

    if(req.user.newPassword!==req.user.confirmPassword){
        return next(new ErrorHandler('password and confirm Password mismatch',400))
    }

    if(req.body.oldPassword===req.body.newPassword){
        return next(new ErrorHandler('Old and new passwords cannot be same',400));
    }

    user.password=req.body.newPassword;

    await user.save();

    sendToken(user,200,res)
})


//update user profile

exports.updateProfile=catchAsyncErrors(async (req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email
    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud=await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:'avatars',
            width:150,
            crop:'scale',
            allowed_formats:['png','jpeg','jpg','webp']
        })
        
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.url,
        };
      }

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        user,
        success:true
    })
})


//get all users -- Admin
exports.getAllUsers=catchAsyncErrors(async (req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//get single users -- Admin
exports.getAUser=catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler('user does not exist',404))
    }
    res.status(200).json({
        success:true,
        user
    })
})

//update user role--admin

exports.updateUserRole=catchAsyncErrors(async (req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })
})


//Delete user -- admin
exports.deleteUser = catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    

    if(!user){
        return next(new ErrorHandler(`User does not exist with the given id i.e. ${req.params.id}`,400))
    }

    await user.remove()

    res.status(200).json({
        success:true
    })
})


//create new review or update the review

exports.createProductReview = catchAsyncErrors(async (req,res,next)=>{
    const {rating,comment,productId}=req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product=await Product.findById(productId);

    const isReviewed=product.reviews.find(
        (rev) => rev.user.toString()===req.user._id.toString()
        );

    if(isReviewed){
        product.reviews.forEach(
            rev=>{
                if(rev.user.toString()===req.user._id.toString()){
                    rev.rating=rating
                    rev.comment=comment
                }
            }
        )
    }
    else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length
    }

    let avg=0;
    product.ratings=product.reviews.forEach(rev=>{
        avg+=rev.rating
    })/product.reviews.length

    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })
})