const mongoose =require('mongoose');

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then((info)=>{
        console.log(`Connected to Mongodb and host info:${info.connection.host}`)
    })
}

module.exports=connectDatabase