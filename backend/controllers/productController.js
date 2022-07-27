const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require('../middleware/catchAsyncError')
const Features=require('../utils/features')
const cloudinary=require('cloudinary')

//Create a new Product
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];
    // console.log(req.body)
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    console.log(images)
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
        allowed_formats:['png','jpeg','jpg','webp']
      });


      console.log(result)
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
  console.log(req.body)
    const product = await Product.create(req.body);
  
    res.status(201).json({
      success: true,
      product,
    });
  });



//Get All Product
exports.getAllProducts=catchAsyncErrors(async(req,res)=>{

    const resultPerPage=6;
    const productsCount=await Product.countDocuments();
    const feature=new Features(Product.find(),req.query).search().filter().pagination(resultPerPage)
    const products=await feature.query;

    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage
    });
})

exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

//update Products
exports.updateProduct=catchAsyncErrors(async(req,res)=>{
    let product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    product =await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidator:true,useFindAndModify:true});

    res.status(200).json({
        success:true,
        product

    })
})



//Get Single product
exports.getProduct=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        product
    })
})



//delete Product 
exports.deleteProduct=catchAsyncErrors(async(req,res)=>{
    let product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

   await product.remove()
    res.status(200).json({
        success:true,
        message:"The product is successfully deleted"
    })
})


exports.createProductReview = catchAsyncErrors(async (req,res,next)=>{
    const {rating,comment,productId}=req.body;
    console.log(req.body);

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
        product.noOfReviews=product.reviews.length;
    }
    else{
        product.reviews.push(review);
        product.noOfReviews=product.reviews.length;
    }

    let avg=0;
    product.ratings=product.reviews.forEach(rev=>{
        avg+=rev.rating
    })/product.reviews.length
    console.log(product)
    await product.save({validateBeforeSave:false})

    res.status(200).json({
        success:true
    })
})



//All product reviews

exports.productReviews=catchAsyncErrors(async(req,res)=>{
    console.log('hello')
    const product=await Product.findById(req.params.id);
    console.log(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })

})


//Delete reviews

exports.deleteReviews=catchAsyncErrors(async(req,res)=>{

    const product=await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews=product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString())

    let avg=0;
    product.ratings=product.reviews.forEach(rev=>{
        avg+=rev.rating
    })/product.reviews.length

    const ratings=avg/reviews.length;

    const numOfReviews=reviews.length;

    await product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidator:true,
        useFindAndModify:false  
    })
    res.status(200).json({
        success:true,
    })

})