const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  registerUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  allUsers,
  getUserProfile,
  deleteUser,
  updateUser,
  loginUser,
  logout,
  updateProfile,
  updatePassword
} = require("../controllers/authController");

const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

router.post("/register",upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword)
router.put("/update/user/:id", isAuthenticatedUser, updateUser);
router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile)


router.get("/admin/all/user", isAuthenticatedUser,authorizeRoles("admin"), allUsers);
router.get("/user/details/:id", getUserDetails);
//router.delete("/delete/user/:id", deleteUser);
router.route('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin',)).delete(deleteUser);
module.exports = router;
