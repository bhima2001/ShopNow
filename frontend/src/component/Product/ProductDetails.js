import React,{Fragment,useEffect} from 'react'
import './ProductDetails.css';
import Carousel from 'react-material-ui-carousel'
import {useSelector,useDispatch} from 'react-redux'
import { getProductDetails,newReview,clearErrors} from '../../actions/productAction';
import { useParams } from "react-router-dom";
import './ProductDetails.css'
import ReactStars from 'react-rating-stars-component'
import ReviewCard from './ReviewCard.js';
import Loader from '../layout/Loader/Loader'
import {useState} from 'react'
import {addItemsToCart} from '../../actions/cartAction'
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { Dialog,DialogTitle,DialogContent,DialogActions,Button,Rating } from '@mui/material';

const ProductDetails = () => {
  const dispatch=useDispatch();
  const {id}=useParams()
  const [quantity,setQuanity]=useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const {product,loading,error}=useSelector((state)=>state.productDetails)
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );

  useEffect(() => {
    dispatch(getProductDetails(id))
  }, [dispatch,id]);

  const options={
    edit:false,
    color:'rgba(20,20,20,0.1)',
    activeColor:'tomato',
    size:window.innerWidth<600?20:25,
    value:product.ratings,
    isHalf:true,
}
const addToCartHandler =()=>{
  dispatch(addItemsToCart(id,quantity))
}
const increaseQuantity=()=>{
  if(product.stock<=quantity)return
  setQuanity((prevQuantity)=>prevQuantity+1);
}
const decreaseQuantity=()=>{
  if(quantity<=1)return
  setQuanity((prevQuantity)=>prevQuantity-1);
}

const submitReviewToggle = () => {
  open ? setOpen(false) : setOpen(true);
};
const reviewSubmitHandler = (e) => {
  e.preventDefault();
  const myForm = new FormData();

  myForm.set("rating", rating);
  myForm.set("comment", comment);
  myForm.set("productId", id);

  dispatch(newReview(myForm));

  setOpen(false);
};

useEffect(() => {
  if (error) {
    dispatch(clearErrors());
  }

  if (reviewError) {
    dispatch(clearErrors());
  }

  if (success) {
    dispatch({ type: NEW_REVIEW_RESET });
  }
  dispatch(getProductDetails(id));
}, [dispatch,id, error, reviewError, success]);
  return (
   <Fragment>
    {loading?(<Loader/>):(
      <Fragment>
      <div className='ProductDetails'>
        <div>
          <Carousel>
            {
              product.images && product.images.map((item,i)=>{
                return <img src={item.url} alt={`${i} Slide`} className='CarouselImage' key={item.url}/>
              })
            }
          </Carousel>
        </div>
        <div>
          <div className='detailsBlock-1'>
            <h2>{product.name}</h2>
            <p>Product # {product._id}</p>
          </div>
          <div className='detailsBlock-2'>
            <ReactStars {...options}></ReactStars>
            <span>({product.noOfReviews} Reviews)</span>
          </div>
          <div className='detailsBlock-3'>
            <h1>{`₹${product.price}`}</h1>
            <div className='detailsBlock-3-1'>
              <div className='detailsBlock-3-1-1'>
                <button onClick={decreaseQuantity}>-</button>
                <input type="number" value={quantity} readOnly/>
                <button onClick={increaseQuantity}>+</button>
              </div>{""}
              <button onClick={addToCartHandler}>Add to cart</button>
            </div>
            <p>
              Status:{" "}
              <strong className={product.stock<1?"redColor":"greenColor"}>
                {product.Stock<1?"OutOfStock":"InStock"}
              </strong>
            </p>
          </div>
          <div className="productDetails-4">
            Description : <p>{product.description}</p>
          </div>
          <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
        </div>
      </div>
      <h3 className="reviewsHeading">Reviews</h3>
      <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => {setRating(e.target.value)}}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
      {product.reviews && product.reviews[0]?(
        <div className="reviews">
          {product.reviews && product.reviews.map((review)=><ReviewCard review={review}/>)}
        </div>
      ):(
        <p className="noReviews">No Reviews Yet</p>
      )}
     </Fragment>
    )}
   </Fragment> 
  )
}

export default ProductDetails