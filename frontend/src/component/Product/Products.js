import React, { Fragment,useEffect } from 'react'
import './Products.css'
import {useSelector,useDispatch} from 'react-redux';
import {clearErrors,getProduct} from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'
import { useParams } from "react-router-dom";
import ProductCard from '../Home/ProductCard'
import Pagination from 'react-js-pagination'
import {useState} from 'react'
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';


const categories=[
    "Laptop",
    "Footwear",
    "Bottom",
    "Attire",
    "Electronics",
    "Household Stuff",
    "Book"
]

const Products = () => {
    const dispatch=useDispatch();
    const [currentPage,setCurrentPage]=useState(1)
    const [category,setCategory]=useState('')
    const [ratings,setRatings]=useState(0)
    const {products,loading,error,productsCount,resultPerPage}=useSelector(state=>state.products)
    const {keyword}=useParams()
    const setCurrentPageNo=(e)=>{
        setCurrentPage(e)
    }
    useEffect(()=>{
        dispatch(getProduct(keyword,currentPage,category,ratings))
    },[dispatch,keyword,currentPage,category,ratings])
  return (
    <Fragment>
        {
            loading?<Loader/>:(
                <Fragment>
                    <h2 className="productsHeading">Products</h2>
                    <div className="products">
                    {
                        products && products.map((product)=><ProductCard key={product._id} product={product}/>)
                    }
                    </div>
                    <div className='categories'>
                        <Typography sx={{font:"400 1.2vmax 'Roboto'"}}><strong>Categories</strong></Typography>
                        <ul className='categoryBox'>{categories.map((category)=><li className='category-link' key={category} onClick={()=>setCategory(category)}>{category}</li>)}</ul>


                        <fieldset>
                            <Typography component='legend'>Ratings Above</Typography>
                            <Slider
                            value={ratings}
                            onChange={(e,newRatings)=>{
                                setRatings(newRatings)
                            }}
                            aria-labelledby='continuous-slider'
                            min={0}
                            max={5}
                            valueLabelDisplay='auto'
                            />
                        </fieldset>
                    </div>
                    {
                        resultPerPage<productsCount && <div className='paginationBox'>
                        <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resultPerPage}
                        totalItemsCount={productsCount}
                        onChange={setCurrentPageNo}
                        nextPageText='Next'
                        prevPageText='Prev'
                        firstPageText='1st'
                        lastPageText='Last'
                        itemClass='page-item'
                        linkClass='page-link'
                        activeClass='pageitemActive'
                        activeLinkClass='pageLinkActive'
                        />
                    </div>
                    }
                </Fragment>
            )
        }
    </Fragment>
  )
}

export default Products