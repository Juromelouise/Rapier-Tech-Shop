import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../Layout/Metadata";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from "../../utils/helpers";

import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Shoe Name is required"),
  price: Yup.number().typeError("Invalid price").required("Price is required"),
  description: Yup.string().required("Product description is required"),
  stock: Yup.number().required("Product stock is required"),
  seller: Yup.string().required("Seller is required"),
  category: Yup.string().required("Category is required"),
});

const UpdateProduct = () => {
    const [supplier, setSupplier] = useState([]);
    const [error, setError] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [isUpdated, setIsUpdated] = useState(false);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState({})
  
    const categories = [
      "Laptop",
      "Phone",
      "Smartwatch",
      "Speaker",
      "Headphone",
      "Earphone",
      "Console",
    ];
  
    let { id } = useParams();
    let navigate = useNavigate();
  
    const errMsg = (message = "") =>
      toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    const successMsg = (message = "") =>
      toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
  
    const getProductDetails = async (id) => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/singleProduct/${id}`
        );
        setProduct(data.products);
        formik.setValues({
          name: data.products.name,
          price: data.products.price,
          description: data.products.description,
          seller: data.products.seller._id,
          stock: data.products.stock,
          category: data.products.category,
        });
        setImagesPreview(data.products.images.flatMap((image) => image.url));
        setLoading(false);
      } catch (error) {
        setError(error.response.data.message);
      }
    };
  
    const getSupplier = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/supplier`,
        config
      );
      setSupplier(data.supplier);
    };
  
    useEffect(() => {
      getSupplier();
      getProductDetails(id);
    }, []);
  
    const updateProduct = async (id, productData) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        };
        const { data } = await axios.put(
          `${process.env.REACT_APP_API}/api/v1/admin/update/product/${id}`,
          productData,
          config
        );
        setIsUpdated(data.success);
      } catch (error) {
        setUpdateError(error.response.data.message);
      }
    };
  
    useEffect(() => {
      if (error) {
        errMsg(error);
      }
      if (updateError) {
        errMsg(updateError);
      }
      if (isUpdated) {
        navigate("/admin/products");
        successMsg("Product updated successfully");
      }
    }, [error, isUpdated, updateError, product, id, navigate]);
  
    const formik = useFormik({
      initialValues: {
        name: "",
        price: "",
        description: "",
        seller: "",
        stock: "",
        category: "",
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        const formData = new FormData();
        formData.set("name", values.name);
        formData.set("price", values.price);
        formData.set("description", values.description);
        formData.set("seller", values.seller);
        formData.set("stock", values.stock);
        formData.set("category", values.category);
  
        images.forEach((image) => {
          formData.append("images", image);
        });
  
        updateProduct(id, formData);
      },
    });
  
    console.log(formik.values);
    const onChange = (e) => {
        const { name, value, type, files } = e.target;
      
        if (type === 'file') {
          // Handle file input separately
          const filesArray = Array.from(files);
          setImagesPreview([]);
          setImages([]);
          setOldImages([]);
          
          filesArray.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (reader.readyState === 2) {
                setImagesPreview((oldArray) => [...oldArray, reader.result]);
                setImages((oldArray) => [...oldArray, reader.result]);
              }
            };
            reader.readAsDataURL(file);
          });
        } else {
          // Handle other input fields
          formik.handleChange(e);
        }
      };
  
  return (
    <Fragment>
      <MetaData title={"Update Product"} />
      <div className="row">
        <div className="col-12 col-md-2"></div>
        <div className="col-12 col-md-10">
          <div className="wrapper my-5">
            <form
              className="shadow-lg"
              onSubmit={formik.handleSubmit}
              encType="multipart/form-data"
            >
              <h1 className="mb-4">Update Product</h1>

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  value={formik.values.name}
                  onChange={onChange}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="error">{formik.errors.name}</div>
                )}
              </div>

              {/* Description Field */}
              <div className="form-group">
                <label htmlFor="description_field">Description</label>
                <textarea
                  className="form-control"
                  id="description_field"
                  rows="8"
                  value={formik.values.description}
    onChange={formik.handleChange}
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <div className="error">{formik.errors.description}</div>
                )}
              </div>

              {/* Category Field */}
              <div className="form-group">
                <label htmlFor="category_field">Category</label>
                <select
                  className="form-control"
                  id="category_field"
                  value={formik.values.category}
                    onChange={formik.handleChange}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="error">{formik.errors.category}</div>
                )}
              </div>

              {/* Price Field */}
              <div className="form-group">
                <label htmlFor="price_field">Price</label>
                <input
                  type="text"
                  id="price_field"
                  className="form-control"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="error">{formik.errors.price}</div>
                )}
              </div>

              {/* Stock Field */}
              <div className="form-group">
                <label htmlFor="stock_field">Stock</label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <div className="error">{formik.errors.stock}</div>
                )}
              </div>

              {/* Seller Field */}
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Seller
                </label>
                <select
                  className="form-control"
                  id="category"
                  name="category"
                  required
                  value={formik.values.seller}
                  onChange={(e, value) => {
                    formik.setFieldValue("seller", e.target.value);
                  }}
                >
                  {supplier.map((suppliers) => (
                    <option key={suppliers._id} value={suppliers._id}>
                      {suppliers.name}
                    </option>
                  ))}
                </select>
                {formik.touched.seller && formik.errors.seller && (
                  <div className="error">{formik.errors.seller}</div>
                )}
              </div>

              {/* Images Field */}
              <div className="form-group">
                <label>Images</label>
                <div className="custom-file">
                  <input
                    type="file"
                    name="images"
                    className="custom-file-input"
                    id="customFile"
                    onChange={onChange}
                    multiple
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Images
                  </label>
                </div>
                {oldImages &&
                  oldImages.map((img) => (
                    <img
                      key={img}
                      src={img.url}
                      alt={img.url}
                      className="mt-3 mr-2"
                      width="55"
                      height="52"
                    />
                  ))}
                {imagesPreview.map((img) => (
                  <img
                    src={img}
                    key={img}
                    alt="Images Preview"
                    className="mt-3 mr-2"
                    width="55"
                    height="52"
                  />
                ))}
              </div>
              {/* Submit Button */}
              <button
                id="login_button"
                type="submit"
                className="btn btn-block py-3"
                disabled={loading ? true : false}
              >
                UPDATE
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default UpdateProduct;
