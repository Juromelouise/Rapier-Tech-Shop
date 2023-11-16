const Product = require("../models/product");
const cloudinary = require("cloudinary");
const APIFeatures = require('../utils/apiFeatures');
// const Order = require('../models/order')

exports.getProducts = async (req, res, next) => {
  const resPerPage = 4;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter();

  // const products = await Product.find();
  apiFeatures.pagination(resPerPage);
  const products = await apiFeatures.query;
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
  const products = await Product.findOne({ _id: req.params.id });
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
  const product = await Product.findByIdAndDelete({ _id: req.params.id });
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
  // let images = [];
  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  // let imagesLinks = [];

  // for (let i = 0; i < images.length; i++) {
  //   let imageDataUri = images[i];
  //   // console.log(imageDataUri)
  //   try {
  //     const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
  //       folder: "products",
  //       width: 150,
  //       crop: "scale",
  //     });

  //     imagesLinks.push({
  //       public_id: result.public_id,
  //       url: result.secure_url,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // req.body.images = imagesLinks;
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
  // let product = await Product.findById(req.params.id);
  // // console.log(req.body)
  // if (!product) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "Product not found",
  //   });
  // }
  // let images = [];

  // if (typeof req.body.images === "string") {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }
  // if (images !== undefined) {
  //   // Deleting images associated with the product
  //   for (let i = 0; i < product.images.length; i++) {
  //     const result = await cloudinary.v2.uploader.destroy(
  //       product.images[i].public_id
  //     );
  //   }
  // }
  // let imagesLinks = [];
  // for (let i = 0; i < images.length; i++) {
  //   const result = await cloudinary.v2.uploader.upload(images[i], {
  //     folder: "products",
  //   });
  //   imagesLinks.push({
  //     public_id: result.public_id,
  //     url: result.secure_url,
  //   });
  // }
  // req.body.images = imagesLinks;
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
