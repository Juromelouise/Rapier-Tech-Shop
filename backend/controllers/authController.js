const User = require("../models/user");
const cloudinary = require("cloudinary");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res, next) => {
  console.log(req.file)
  const cloudinaryResult = await cloudinary.v2.uploader.upload(
    req.body.avatar,
    {
      folder: "avatars",
      width: 150,
      crop: "scale",
    },
    (err, result) => {
      console.log(err, result);
    }
  );

  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: {
      public_id: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
    },
  });

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "user not created",
    });
  }

  sendToken(user, 200, res);
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter email & password" });
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  sendToken(user, 200, res);
};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ error: "User not found with this email" });
    // return next(new ErrorHandler('User not found with this email', 404));
  }
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // Create reset password url
  const resetUrl = `${req.protocol}://localhost:3000/reset/password/${resetToken}`;
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Pizza Shop Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ error: error.message });
    // return next(new ErrorHandler(error.message, 500))
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(400)
      .json({ message: "Password reset token is invalid or has been expired" });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ message: "Password does not match" });
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
};

exports.getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log(user);
  res.status(200).json({
    success: true,
    user,
  });
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("password");
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }
  user.password = req.body.password;
  await user.save();
  sendToken(user, 200, res);
};

exports.updateProfile = async (req, res, next) => {
  const newUserData = {
      name: req.body.name,
      email: req.body.email
  }

  // Update avatar
  if (req.body.avatar !== '') {
      const user = await User.findById(req.user.id)

      const image_id = user.avatar.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: 'avatars',
          width: 150,
          crop: "scale"
      })

      newUserData.avatar = {
          public_id: result.public_id,
          url: result.secure_url
      }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
  })
  if (!user) {
      return res.status(401).json({ message: 'User Not Updated' })
  }

  res.status(200).json({
      success: true
  })
}

exports.allUsers = async (req, res, next) => {
  const users = await User.find();
  const usersCount = users.length;
  res.status(200).json({
    success: true,
    usersCount,
    users,
  });
};

exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(400)
      .json({ message: `User does not found with id: ${req.params.id}` });
  }

  res.status(200).json({
    success: true,
    user,
  });
};

exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(401)
      .json({ message: `User does not found with id: ${req.params.id}` });
  }
  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);
  await User.findByIdAndRemove(req.params.id);
  return res.status(200).json({
    success: true,
  });
};

exports.updateUser = async (req, res, next) => {
  const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      // useFindAndModify: false
  })

  return res.status(200).json({
      success: true
  })
}

exports.newUser = async (req, res, next) => {
  try {
    console.log(req.body);

    const cloudinaryResult = await cloudinary.v2.uploader.upload(
      req.body.avatar,
      {
        folder: "avatars",
        width: 150,
        crop: "scale",
      }
    );

    console.log(cloudinaryResult);

    if (!cloudinaryResult || cloudinaryResult.error) {
      return res.status(400).json({
        success: false,
        message: "Error uploading avatar to Cloudinary",
      });
    }

    const user = await User.create(req.body);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not created",
      });
    }

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

