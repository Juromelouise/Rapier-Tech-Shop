const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getSinglesupplier,
  getSupplier,
} = require("../controllers/supplierController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth");

router.get("/admin/supplier", isAuthenticatedUser, authorizeRoles("admin"), getSupplier);
router.get("/singleSupplier", getSinglesupplier);

module.exports = router;
