import React,{useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { MdSearch } from "react-icons/md";
import TextField from '@mui/material/TextField';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Link from '@mui/material/Link';
import {useNavigate} from 'react-router-dom'
import UserOptions from './UserOptions.js'
import {useSelector} from 'react-redux'

function Header(){
    const {isAuthenticated,user}=useSelector((state)=>state.user)
    const [keyword,setKeyword]=useState('')
    const navigate=useNavigate();
    const searchSubmitHandler=()=>{
        if(keyword.trim()){
            navigate(`/products/${keyword}`)
        }else{
            navigate(`/products`)
        }

    }
    return (
        <AppBar position='fixed' sx={{bgcolor:'#D6D3C4'}}>
            <Typography variant='div' children='node' sx={{display:'flex'}}>
                <Button variant='text' sx={{color:'black',fontSize:'1.5rem',marginRight:'10rem'}}>Ecommerce</Button>
                <Typography variant='subtitle1' sx={{color:'black',fontSize:'1.5rem',margin:'0.38rem 2rem 0rem 1rem'}}><Link  style={{textDecoration:'none',color:'black'}} href="http://localhost:3000">Home</Link></Typography>
                <Typography variant='subtitle1' sx={{color:'black',fontSize:'1.5rem',margin:'0.38rem 2rem 0rem 1rem'}}><Link  style={{textDecoration:'none',color:'black'}} href="http://localhost:3000/products">Products</Link></Typography>
                <Typography variant='subtitle1' sx={{color:'black',fontSize:'1.5rem',margin:'0.38rem 2rem 0rem 1rem'}}>Contact</Typography>
                <Typography variant='subtitle1' sx={{color:'black',fontSize:'1.5rem',margin:'0.38rem 2rem 0rem 1rem'}}>About</Typography>
                <TextField id="standard-basic" placeholder="Search for product..." variant="standard" color="primary" onChange={(e)=>setKeyword(e.target.value)} sx={{color:'black',fontSize:'1.5rem',marginLeft:'15rem',marginTop:'1rem'}}/>
                <Button variant='button' sx={{color:'black',fontSize:'1.5rem',margin:'0.38rem 2rem 0rem 1rem',cursor:'pointer'}} onClick={searchSubmitHandler}><MdSearch/></Button>
                <Button  sx={{color:'black',fontSize:'1.5rem',margin:'1rem 1rem 0rem 0rem',cursor:'pointer'}} onClick={()=>navigate('/cart')}><ShoppingCartIcon/></Button>
                {(isAuthenticated)?(<UserOptions user={user}/>):(<Typography variant='subtitle1' sx={{color:'black',fontSize:'1.5rem',margin:'1rem 0rem 0rem 1rem',cursor:'pointer'}}><Link style={{color:'black'}} href="http://localhost:3000/login"><AccountBoxIcon/></Link></Typography>)}
            </Typography>
        </AppBar>
    )
}


export default Header;
