const Product = require("../models/product");
const cloudinary = require("cloudinary");

exports.getProducts = async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};

exports.getSingleProduct = async (req, res, next) => {
  const products = await Product.findOne({_id: req.params.id});
  console.log(products);
  if (!products) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    products,
  });
};

exports.deleteProduct = async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);
	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		});
	}
	// await product.remove();
	res.status(200).json({
		success: true,
		message: 'Product deleted',
	});
};
