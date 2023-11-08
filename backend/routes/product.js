const express = require("express");
const router = express.Router();

const { getProducts, getSingleProduct, deleteProduct, newProduct, updateProduct } = require("../controllers/productController");

router.get("/products", getProducts);
router.get("/singleProduct/:id", getSingleProduct);
router.delete('/delete/product/:id', deleteProduct)
router.post('/new/product', newProduct)
router.put('/update/product/:id', updateProduct)

module.exports = router;
