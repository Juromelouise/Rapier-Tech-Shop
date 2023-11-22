const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getSinglesupplier,
  getSupplier,
  newSupplier
} = require("../controllers/supplierController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth");

router.get("/admin/supplier", isAuthenticatedUser, authorizeRoles("admin"), getSupplier);
router.get("/singleSupplier", getSinglesupplier);
router.post("/admin/new/supplier", isAuthenticatedUser, authorizeRoles("admin"), newSupplier);

module.exports = router;
