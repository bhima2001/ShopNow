const express=require('express');
const { route } = require('../app');
const router=express.Router();
const {newOrder, getSingleOrder, getMyorders, getAllOrders, updateOrder,deleteOrder}=require('../controllers/orderController');

const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth');


router.route('/order/new').post(isAuthenticatedUser,newOrder);

router.route('/order/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getSingleOrder);

router.route('/orders/me').get(isAuthenticatedUser,getMyorders)

router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles('admin'),getAllOrders);

router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder).delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder);

module.exports=router