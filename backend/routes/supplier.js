const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  getSinglesupplier,
  getSupplier,
  newSupplier,
  deleteSupplier,
  updateSupplier
} = require("../controllers/supplierController");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/auth");

router.get("/admin/supplier", isAuthenticatedUser, authorizeRoles("admin"), getSupplier);
router.get("/singleSupplier/:id", getSinglesupplier);
router.post("/admin/new/supplier", isAuthenticatedUser, authorizeRoles("admin"),upload.array('images', 10), newSupplier);

router.route('/admin/supplier/:id', isAuthenticatedUser, authorizeRoles('admin',)).put(upload.array('images', 10), updateSupplier).delete(deleteSupplier);

module.exports = router;
