const express = require('express')
const router = express.Router();


const { newOrder,
		getSingleOrder,
	    myOrders,
	    allOrders,
	    updateOrder,
	    deleteOrder,
		totalOrders,
		totalSales,
		customerSales,
		salesPerMonth,
		updateStatus
	} = require('../controllers/orderController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

router.post('/new/order', isAuthenticatedUser, newOrder);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);
router.get('/orders/me', isAuthenticatedUser, myOrders);
router.get('/admin/orders/', isAuthenticatedUser,authorizeRoles('admin'),  allOrders);
router.route('/admin/order/:id').put(isAuthenticatedUser, updateOrder).delete(isAuthenticatedUser,  deleteOrder);
router.put('/admin/order/:id', isAuthenticatedUser, updateStatus)
router.get('/admin/total-orders', totalOrders);
router.get('/admin/total-sales', totalSales);
router.get('/admin/customer-sales', customerSales);
router.get('/admin/sales-per-month', salesPerMonth);
router.delete('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin',),deleteOrder)
module.exports = router;