const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const crypto=require('crypto')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter your name'],
        maxLength:[30,'Max length reached'],
        minLength:[5,'Name should have more than 5 characters']
    },
    email:{
        type:String,
        required:[true,'Please Enter your Email'],
        unique:true,
        validator:[validator.isEmail,'Please enter a valid Email']
    },
    password:{
        type:String,
        required:[true,'Please enter a password'],
        minLength:[8,'Password should should have atleast 8 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:String
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }

    this.password=await bcrypt.hash(this.password,10);
})

//JWT Token
userSchema.methods.generateJWT = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}


//compare password 

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


//reset password 
userSchema.methods.passwordReset=async function(){

    //Generate Token
    const resetToken=crypto.randomBytes(20).toString('hex');
    //Hasing the generated Token
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire=Date.now()+15*60*1000;

    return resetToken;
}


module.exports=mongoose.model('User',userSchema)