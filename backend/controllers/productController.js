const Product = require("../models/product");
const cloudinary = require("cloudinary");
const APIFeatures = require("../utils/apiFeatures");
const Supplier = require('../models/supplier')
// const Order = require('../models/order')

exports.getSupplier = async (req, res, next) => {
  const product = await Product.find().populate({
    path: "seller",
    model: Supplier
  })
  res.status(201).json({
    product
  })
};

exports.getImage = async (req, res, next) => {
  const imageProduct = await Product.find();
  let product = imageProduct;
  res.status(200).json({
    success: true,
    product,
  });
};

exports.getProducts = async (req, res, next) => {
  const resPerPage = 4;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();

  apiFeatures.pagination(resPerPage);
  const products = await apiFeatures.query;
  console.log(products)
  let filteredProductsCount = products.length;
  res.status(200).json({
    success: true,
    filteredProductsCount,
    productsCount,
    products,
    resPerPage,
  });
};

exports.getSingleProduct = async (req, res, next) => {
  try {
    const products = await Product.findOne({ _id: req.params.id }).populate('seller');
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
  } catch (error) {
    // Handle any errors that might occur during the execution of the code
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findByIdAndDelete({ _id: req.params.id }).populate({
    path: "seller",
    model: Supplier
  });
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  // await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted",
  });
};

exports.newProduct = async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];
    // console.log(imageDataUri)
    try {
      const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
        folder: "products",
        width: 150,
        crop: "scale",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.log(error);
    }
  }

  req.body.images = imagesLinks;
  // req.body.user = req.user.id;

  const product = await Product.create(req.body);
  if (!product)
    return res.status(400).json({
      success: false,
      message: "Product not created",
    });

  res.status(201).json({
    success: true,
    product,
  });
};

exports.updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  // console.log(req.body)
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  if (images !== undefined) {
    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }
  }
  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLinks;
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindandModify: false,
  });
  // console.log(product)
  return res.status(200).json({
    success: true,
    product,
  });
};

exports.createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (r) => r.user && r.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      console.log(review);
      if (review.user && review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  if (!product)
    return res.status(400).json({
      success: false,
      message: "review not posted",
    });
  return res.status(200).json({
    success: true,
  });
};
