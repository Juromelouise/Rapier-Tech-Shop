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
  updatePassword,
  newUser
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

router.post("/admin/new/user", isAuthenticatedUser, authorizeRoles("admin"), newUser);
router.get("/admin/all/user", isAuthenticatedUser,authorizeRoles("admin"), allUsers);
router.put('/admin/user/update/:id', isAuthenticatedUser, authorizeRoles('admin'), updateUser)
//router.delete("/delete/user/:id", deleteUser);
router.get("/admin/user/details/:id",isAuthenticatedUser, getUserDetails);
router.delete('/admin/user/:id', isAuthenticatedUser, authorizeRoles('admin',),deleteUser)
module.exports = router;
