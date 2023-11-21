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

