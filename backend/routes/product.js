const express = require("express");
const router = express.Router();
const upload = require('../utils/multer')

const { getProducts, getSingleProduct, deleteProduct, newProduct, updateProduct, getSupplier } = require("../controllers/productController");
const {authorizeRoles, isAuthenticatedUser} = require('../middleware/auth')

router.get("/products", getProducts);
router.get("/admin/products", isAuthenticatedUser, authorizeRoles("admin"), getProducts);
router.get("/get/supplier", getSupplier);
router.get("/singleProduct/:id", getSingleProduct);
//router.delete('/delete/product/:id',isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)
router.route('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin',)).delete(deleteProduct);
// router.post('/new/product',isAuthenticatedUser, upload.array('images', 10), newProduct)
router.post("/admin/new/product", isAuthenticatedUser, authorizeRoles("admin"),upload.array('images', 10), newProduct);
router.put('/update/product/:id',isAuthenticatedUser, updateProduct)

module.exports = router;
