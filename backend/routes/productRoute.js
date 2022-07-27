const express=require('express');
const router=express.Router();
const {getAllProducts, createProduct, deleteProduct, getProduct, updateProduct, deleteReviews, productReviews,createProductReview,getAdminProducts} = require('../controllers/productController');
const { isAuthenticatedUser,authorizeRoles } = require('../middleware/auth');

router.route('/products').get(getAllProducts)

router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)

router.route('/admin/product/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct).get(getProduct)

router.route('/review').put(isAuthenticatedUser,createProductReview)

router.route('/reviews/:id').get(productReviews).delete(isAuthenticatedUser,deleteReviews)

module.exports=router