const express = require("express");
const router = express.Router();

const { getProducts, getSingleProduct, deleteProduct } = require("../controllers/productController");

router.get("/products", getProducts);
router.get("/singleProduct/:id", getSingleProduct);
router.delete('/delete/product/:id', deleteProduct)

module.exports = router;
