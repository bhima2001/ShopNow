
//Token Creation and saving in cookie


const sendToken=(user,statusCode,res)=>{
    const token =user.generateJWT();
    console.log(Date.now(),(Math.floor(Date.now() / 1000) + (60*60*24))*1000)
    const options={
        expires:new Date(
            Date.now()+(24*60*60*1000)
        ),
        httpOnly: true
    }
    res.status(statusCode).cookie('token',token,options).json({ 
        success:true,
        user,
        token
    })
}

module.exports=sendToken