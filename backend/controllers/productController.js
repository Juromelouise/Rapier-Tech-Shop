const Product = require('../models/product')

exports.getProducts = async (req, res, next) => {
	const products = await Product.find({});
	res.status(200).json({
		success: true,
		count: products.length,
		products
	})
}