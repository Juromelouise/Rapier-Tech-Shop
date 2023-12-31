const express = require('express')
const router = express.Router();
const { newOrder,
		getSingleOrder,
	    myOrders,
	    allOrders,
	    updateOrder,
	    deleteOrder,
		salesPerMonth,
		updateStatus,
		sumSupplier,
		getUserOrderSum 
	} = require('../controllers/orderController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

router.post('/new/order', isAuthenticatedUser, newOrder);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);
router.get('/orders/me', isAuthenticatedUser, myOrders);
router.get('/admin/orders/', isAuthenticatedUser,authorizeRoles('admin'),  allOrders);
router.route('/admin/order/:id').delete(isAuthenticatedUser,  deleteOrder);
router.put('/admin/order/:id', isAuthenticatedUser, updateStatus)
router.get('/admin/chart3',isAuthenticatedUser, salesPerMonth);
router.get('/admin/chart1',isAuthenticatedUser, sumSupplier);
router.delete('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin',),deleteOrder)
router.get('/admin/chart2', isAuthenticatedUser, getUserOrderSum);
module.exports = router;