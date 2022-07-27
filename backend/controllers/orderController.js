
const Order=require('../models/orderModel')

const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require('../middleware/catchAsyncError')

//Create new order
exports.newOrder=catchAsyncErrors(async(req,res,next)=>{
    const { shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}  = req.body;
    console.log('shippingInfo:',shippingInfo,'orderItems:',orderItems,'paymentInfo:',paymentInfo,'itemsPrice',itemsPrice,'taxprice',taxPrice,'shippingprice:',shippingPrice,'totalPrice:',totalPrice)
    const order=await Order.create({ shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidOn:Date.now(),user:req.user._id });


    res.status(201).json({
        success:true,
        order
    })
})


//get Single order i

exports.getSingleOrder=catchAsyncErrors(async(req,res,next)=>{
    
    const order=await Order.findById(req.params.id).populate('user','name email');

    if(!order){
        return next(new ErrorHandler("Order not found",404))
    }

    res.status(200).json({
        success:true,
        order
    })
})

//get my orders

exports.getMyorders=catchAsyncErrors(async(req,res,next)=>{
    console.log(req.user._id)
    const order=await Order.find({user:req.user._id});
    console.log(order)
    if(!order){
        return next(new ErrorHandler("Order not found",404))
    }

    res.status(200).json({
        success:true,
        order
    })
})


//get all order --admin

exports.getAllOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find();

    if(!orders){
        return next(new ErrorHandler("No orders at present",404))
    }

    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice
    })

    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

//update order details --admin

exports.updateOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(order.orderStatus==='Delivered'){
        return next(new ErrorHandler('you have already delivered this order',404))
    }

    order.orderItems.forEach(async (o)=>{
        await updateStock(o.product,o.quantity)
    })

    order.orderStatus=req.body.status;
    if(req.body.status=='Delivered')order.deliveredOn=Date.now();

    await order.save({validateBeforeSave:false})

    res.status(200).json({
        success:true,
        order
    })
})

async function updateStock(id,quantity){
    const product=await Product.findById(id);

    product.stock-=quantity;
    await product.save({validateBeforeSave:false})
}


//delete Order -- admin 

exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById({user:req.params.id});

    if(!order){
        return next(new ErrorHandler('order not found',404));
    }

    await order.remove();

    res.status(200).json({
        success:true
    })
})