const mongoose=require("mongoose");


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter the product Name"]
    },
    description:{
        type:String,
        required:[true,"Please give a Description to your product"],
    },
    price:{
        type:Number,
        required:[true,"Give the price of the product"],
        maxLength:[8,"Price cannot exceed 8 digits"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Please give a Category to your product"]
    },
    stock:{
        type:Number,
        required:[true,"Provide the number of products you have."],
        default:100
    },
    noOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
              },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                required:true
            },
            default:[]
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


module.exports=mongoose.model("Product",productSchema)