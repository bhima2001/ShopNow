import React,{Fragment,useState} from 'react'
import './userOptions.css'
import {SpeedDial, SpeedDialAction} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {useNavigate} from 'react-router-dom'
import {logout} from '../../../actions/userAction'
import {useDispatch} from 'react-redux'
import Backdrop from '@mui/material/Backdrop';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const UserOptions = ({user}) => {
  const dispatch=useDispatch()
  const navigate=useNavigate();
  const [open,setOpen]=useState(false)
  const options=[
    {icon:<ListAltIcon/>,name:'Orders',func:orders},
    {icon:<PersonIcon/>,name:'Profile',func:account},
    {icon:<ShoppingCartIcon/>,name:'Cart',func:cart},
    {icon:<ExitToAppIcon/>,name:'Logout',func:logoutUser}
  ]
  if(user.role==='admin'){
    options.unshift({icon:<DashboardIcon/>,name:'Dashboard',func:dashboard})
  }

  function dashboard(){
    navigate('/admin/dashboard');
  }
  function account(){
    navigate('/account')
  }
  function orders(){
    navigate('/orders')
  }
  function logoutUser() {
    dispatch(logout());
    navigate('/')
  }
  function cart(){
    navigate('/cart')
  }
  return (
    <Fragment>
      <Backdrop open={open} sx={{zindex:'10'}}/>
      <SpeedDial
      ariaLabel='SpeedDial tooltip example'
      onClose={()=>setOpen(false)}
      onOpen={()=>setOpen(true)}
      open={open}
      direction='down'
      sx={{position:'absolute',left:'90rem',top:'0.25rem'}}
      icon={
        <img
        className='speedDialIcon'
        src={user.avatar.url ? user.avatar.url:"https://t3.ftcdn.net/jpg/03/46/83/96/240_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"}
        alt='Profile'
        />
      }
      >
        {
          options.map((option)=><SpeedDialAction icon={option.icon} tooltipTitle={option.name} onClick={option.func} key={option.name}/>)
        }
      </SpeedDial>
    </Fragment>
  )
}

export default UserOptions