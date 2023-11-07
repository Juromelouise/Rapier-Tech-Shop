const express = require("express");
const router = express.Router();

const { getProducts, getSingleProduct } = require("../controllers/productController");

router.get("/products", getProducts);
router.get("/singleProduct/:id", getSingleProduct);

module.exports = router;
