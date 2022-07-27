import React,{Fragment,useEffect} from 'react'
import './LoginSignUp.css'
import {Link} from 'react-router-dom'
import {useState,useRef} from 'react'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import profilePng from '../images/profilePng.jpg'
import { useFormControl } from '@mui/material';
import {useDispatch,useSelector} from 'react-redux';
import {clearErrors,login,register} from '../../actions/userAction'
import {useNavigate,useLocation} from 'react-router-dom'


const LoginSignUp = () => {
    const loginTab=useRef(null);
    const registerTab=useRef(null);
    const switcherTab=useRef(null);
    const avatarTab=useRef(null);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const location=useLocation()
    const {error,loading,isAuthenticated}=useSelector((state)=>state.user)

    const [loginEmail,setLoginEmail]=useState('');
    const [loginPassword,setLoginPassword]=useState('');
    const [user,setUser]=useState({
        name:'',
        email:'',
        password:'',
    })
    const [avatar,setAvatar]=useState('');
    const [avatarPreview,setAvatarPreview]=useState(profilePng);

    const switchTab=(e,tab)=>{
        if(tab==='login'){
            switcherTab.current.classList.add('shiftToNeutral')
            switcherTab.current.classList.remove('shiftToRight')

            registerTab.current.classList.remove('shiftToNeutralForm')
            loginTab.current.classList.remove('shiftToLeft')
        }
        if(tab==='register'){
            switcherTab.current.classList.add('shiftToRight')
            switcherTab.current.classList.remove('shiftToNeutral')

            registerTab.current.classList.add('shiftToNeutralForm')
            loginTab.current.classList.add('shiftToLeft')
        }
    }

    const loginSubmitHandler=(e)=>{
        e.preventDefault();
        dispatch(login(loginEmail,loginPassword))
    }
    const redirect = location.search ? location.search.split("=")[1] : "account";

    useEffect(()=>{
        if(error){
            dispatch(clearErrors());
        }
        if(isAuthenticated){
            navigate('/'+redirect)
        }
    },[error,dispatch,isAuthenticated,navigate,redirect])

    const registerSubmit=(e)=>{
        e.preventDefault()
        const myForm=new FormData();
        console.log(typeof avatar)
        myForm.set('name',user.name);
        myForm.set('email',user.email);
        myForm.set('password',user.password);
        myForm.set('avatar',avatar);
        dispatch(register(myForm))
    }
    
    const registerDataChange=(e)=>{
        if(e.target.name==='avatar'){
            const reader=new FileReader();

            reader.onload=()=>{
                if(reader.readyState===2){
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result);
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        }else{
            setUser({...user,[e.target.name]:e.target.value})
        }
    }    
  return (
    <Fragment>
        <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
                <div>
                    <div className='login_signUp_toggle'>
                        <p onClick={(e)=>switchTab(e,'login')}>LOGIN</p>
                        <p onClick={(e)=>switchTab(e,'register')}>REGISTER</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>
                <form className="loginForm" ref={loginTab} onSubmit={loginSubmitHandler}>
                    <div className='loginEmail'>
                        <MailOutlineIcon/>
                        <input type="email" placeholder="Email" required  value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)}/>
                    </div>
                    <div className="loginPassword">
                        <LockOpenIcon/>
                        <input type="password" placeholder="Password" required  value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)}/>
                    </div>
                    <Link to='/password/forgot'>Forget Password?</Link>
                    <input type="submit" value='Login' className='loginBtn' />
                </form>
                <form
                className='signUpForm'
                ref={registerTab}
                encType='multipart/form data'
                onSubmit={registerSubmit}
                >
                    <div className='signUpName'>
                        <TagFacesIcon/>
                        <input type="text" placeholder="Name" name='name' value={user.name} onChange={registerDataChange} required/>
                    </div>
                    <div className="signUpEmail">
                    <MailOutlineIcon/>
                    <input type="email" placeholder="Email" name='email' value={user.email} onChange={registerDataChange} required/>
                    </div>
                    <div className='signUpPassword'>
                    <LockOpenIcon/>
                    <input type="password" placeholder="Password" name='password' value={user.password} onChange={registerDataChange} required/>
                    </div>
                    <div id='registerImage'>
                        <img src={avatarPreview} alt="Avatar Preview" />
                        <input type="file" name='avatar' accepts='image/' ref={avatarTab} onChange={registerDataChange} required/>
                    </div>
                    <input type="submit" value='Register' className='signUpBtn' />
                </form>
            </div>
        </div>
    </Fragment>
  )
}

export default LoginSignUp