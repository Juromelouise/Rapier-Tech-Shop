const Supplier = require("../models/supplier");
const cloudinary = require("cloudinary");

exports.getSupplier = async (req, res, next) => {
  const supplier = await Supplier.find();
  res.status(200).json({
    success: true,
    supplier,
  });
};

exports.getSinglesupplier = async (req, res, next) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    res.status(404).json({
      success: false,
      message: "Supplier Doesn't exist",
    });
  }
  res.status(200).json({
    success: true,
    supplier,
  });
};

exports.newSupplier = async (req, res, next) => {
  let images = [];
  if (typeof req.body.logo === "string") {
    images.push(req.body.logo);
  } else {
    images = req.body.images;
  }

  let logos = [];

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];
    // console.log(imageDataUri)
    try {
      const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
        folder: "supplier",
        width: 150,
        crop: "scale",
      });

      logos.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.log(error);
    }
  }

  req.body.images = imagesLinks;

  const supplier = await Supplier.create(req.body);
  if (!supplier)
    return res.status(400).json({
      success: false,
      message: "Supplier not created",
    });

  res.status(201).json({
    success: true,
    supplier,
  });
};

