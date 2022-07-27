import Header from './component/layout/Header/Header.js';
import {BrowserRouter as Router , Route,Routes} from 'react-router-dom'
import React,{useEffect,useState} from 'react'
import Footer from './component/layout/Footer/footer.js';
import Home from './component/Home/Home.js'
import './App.css' 
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.js';
import LoginSignUp from './component/User/LoginSignUp'
import store from './store'
import {loadUser} from './actions/userAction'
import Profile from './component/User/Profile.js';
import Protected from './component/Route/Protected'
import UpdateProfile from './component/User/UpdateProfile.js';
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js'
import ResetPassword from './component/User/ResetPassword.js'
import Cart from './component/Cart/Cart.js'
import Shipping from './component/Cart/Shipping.js'
import ConfirmOrder from './component/Cart/ConfirmOrder.js'
import axios from 'axios'
import Payment from './component/Cart/Payment.js'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from './component/Cart/OrderSuccess.js'
import MyOrders from './component/Order/MyOrders'
import OrderDetails from './component/Order/OrderDetails'
import Dashboard from './component/Admin/Dashboard'
import NewProduct from './component/Admin/NewProduct'
import OrderList from './component/Admin/OrderList'
import ProductList from './component/Admin/ProductList'
import ProcessOrder from './component/Admin/ProcessOrder'
import UsersList from './component/Admin/UsersList'
import UpdateProduct  from './component/Admin/UpdateProduct.js';
import UpdateUser from './component/Admin/UpdateUser.js';
import ProductReviews from "./component/Admin/ProductReviews";
import NotFound from './component/layout/Not Found/NotFound'
import Contact from './component/layout/Contact/Contact'
import About from './component/layout/About/About'

function App() {
  const [stripeApiKey,setStripeApiKey]=useState('')
  console.log(window.location.pathname)
  const getStripeApiKey=async()=>{
    const {data}=await axios.get('/api/v1/stripeapikey');
    
    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    store.dispatch(loadUser());
    getStripeApiKey()
    console.log(stripeApiKey)
  }, [stripeApiKey]);

  // window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (
    <Router>
      <Header/>
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route exact path='/product/:id' element={<ProductDetails/>}/>
        <Route exact path='/products' element={<Products/>}/>
        <Route path='/products/:keyword' element={<Products/>}/>
        <Route exact path='/account' element={<Protected><Profile/></Protected>}/>
        <Route exact path='/login' element={<LoginSignUp/>}/>
        <Route exact path='/me/update' element={<Protected><UpdateProfile/></Protected>}/>
        <Route exact path='/password/update' element={<Protected><UpdatePassword/></Protected>}/>
        <Route exact path='/password/forgot' element={<ForgotPassword/>}/>
        <Route exact path='/password/reset/:token' element={<ResetPassword/>} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/shipping' element={<Protected><Shipping/></Protected>}/>
        <Route path='/order/confirm' element={<Protected><ConfirmOrder/></Protected>}/>
        <Route exact path='/process/payment' element={<Protected>{stripeApiKey&&<Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements>}</Protected>}/>
        <Route exaxct path='/success' element={<OrderSuccess/>}/>
        <Route exaxct path='/orders' element={<Protected><MyOrders/></Protected>}/>
        <Route exact path='/order/:id' element={<Protected><OrderDetails/></Protected>}/>
        <Route exact path='/admin/dashboard' element={<Protected><Dashboard/></Protected>}/>
        <Route exact path='/admin/product' element={<Protected><NewProduct/></Protected>}/>
        <Route exact path='/admin/orders' element={<Protected><OrderList/></Protected>}/> 
        <Route exact path='/admin/products' element={<Protected><ProductList/></Protected>}/>
        <Route exact path='admin/order/:id' element={<Protected><ProcessOrder/></Protected>}/>
        <Route exact path='admin/users' element={<Protected><UsersList/></Protected>}/>
        <Route exact path='admin/product/:id' element={<Protected><UpdateProduct/></Protected>}/>
        <Route exact path='admin/user/:id' element={<Protected><UpdateUser/></Protected>}/>
        <Route exact path='admin/reviews' element={<Protected><ProductReviews/></Protected>}/>
        <Route exact path="/contact" element={<Contact/>} />
        <Route exact path="/about" element={<About/>} />
        <Route path='*' element={window.location.pathname === "/process/payment" ? null : <NotFound/>}/>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
