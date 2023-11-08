const User = require("../models/user");

exports.registerUser = async (req, res, next) => {
  // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
  //     folder: 'avatars',
  //     width: 150,
  //     crop: "scale"
  // }, (err, res) => {
  //     console.log(err, res);
  // });
  const { name, email, password, avatar } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: avatar.public_id,
      url: avatar.url,
    },
    // role,
  });
  // const token = user.getJwtToken();
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "user not created",
    });
  }
  res.status(200).json({
    
    message: "diko alam checkmo",
  });
};
