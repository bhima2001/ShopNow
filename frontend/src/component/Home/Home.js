import React,{Fragment,useEffect} from 'react'
import {CgMouse} from 'react-icons/cg'
import './Home.css'
import ProductCard from './ProductCard.js'
import MetaData from '../layout/MetaData'
import {useSelector,useDispatch} from 'react-redux'
import { getProduct } from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'

const Home = ()=>{
   const dispatch=useDispatch();
   const {loading,error,products,productsCount}=useSelector(
       (state)=>state.products
   )
   useEffect(() => {
      dispatch(getProduct())
    },[dispatch,error]);
    return <Fragment>
        {loading ? <Loader/>:<Fragment>
        <MetaData title="Eccomerce"/>
        <div className='banner'>
            <p>Welcome to Ecommerce</p>
            <h1>Products are listed below</h1>

            <a href="#productList">
                <button>
                    Scroll  <CgMouse/>
                </button>
            </a>
        </div>
        <h2 className="featuredProducts">Featured Products</h2>
        <div className='productList' id="productList">
            {
                products && products.map((product)=>{
                    return <ProductCard product={product} key={product._id}/>
                })
            }
        </div>
    </Fragment> 
    }
    </Fragment>
}

export default Home;