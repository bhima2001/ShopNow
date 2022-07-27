const app=require('./app');
const connectDatabase=require('./database/database')
const cloudinary=require('cloudinary')
//config
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'backend/config/config.env'})
}

//connecting to Database
connectDatabase()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})


//Unhandled Promise Rejection
process.on('unhandledRejection',err=>{
    console.log(`err:${err.message}`);
    console.log('Turning the server off');
    server.close(()=>{
        process.exit(1)
    });
})