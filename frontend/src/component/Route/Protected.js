import React from 'react'
import {useSelector} from 'react-redux'
import {Navigate} from 'react-router-dom'


const Protected = ({children}) => {
    const {loading,isAuthenticated}=useSelector((state)=>state.user)
    if(!loading){
        if(isAuthenticated){
            return children
        }
        // return <Navigate to='/login'/>
    }
}

export default Protected