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

const { isAuthenticatedUser } = require("../middleware/auth");

router.post("/register",upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);

router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getUserProfile);
// router.get("/all/users", isAuthenticatedUser, allUsers);
// router.get("/user/details/:id", isAuthenticatedUser, getUserDetails);
// router.delete("/delete/user/:id", isAuthenticatedUser, deleteUser);
router.put('/password/update', isAuthenticatedUser, updatePassword)
router.put("/update/user/:id", isAuthenticatedUser, updateUser);
router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile)

// router.get("/me", getUserProfile);
router.get("/all/users", allUsers);
router.get("/user/details/:id", getUserDetails);
router.delete("/delete/user/:id", deleteUser);
// router.put("/update/user/:id", updateUser);

module.exports = router;
