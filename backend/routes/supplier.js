const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getSinglesupplier,
  getSupplier,
} = require("../controllers/supplierController");

router.get("/supplier", getSupplier);
router.get("/singleSupplier", getSinglesupplier);

module.exports = router;
