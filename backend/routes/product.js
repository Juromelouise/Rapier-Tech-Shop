const express = require("express");
const router = express.Router();
const upload = require('../utils/multer')

const { getProducts, getSingleProduct, deleteProduct, newProduct, updateProduct, getImage } = require("../controllers/productController");
const {authorizeRoles, isAuthenticatedUser} = require('../middleware/auth')

router.get("/products", getProducts);
router.get("/image", getImage);
router.get("/singleProduct/:id", getSingleProduct);
router.delete('/delete/product/:id',isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)
router.post('/new/product',isAuthenticatedUser, upload.array('images', 10), newProduct)
router.put('/update/product/:id',isAuthenticatedUser, updateProduct)

module.exports = router;
