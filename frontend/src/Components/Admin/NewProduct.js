import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
import { useFormik } from "formik";
import * as Yup from "yup";
// import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().required("Price is required"),
  stock: Yup.number().required("Stock is required"),
  seller: Yup.string().required("Seller is required"),
});

const NewProduct = () => {
  const [supplier, setSupplier] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);  
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop",
    "Phone",
    "Smartwatch",
    "Speaker",
    "Headphone",
    "Earphone",
    "Console",
  ];

  let navigate = useNavigate();

  const getSupplier = async () => {
    try {
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
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    getSupplier();
  }, []);

  const newProduct = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/admin/new/product`,
        formData,
        config
      );
      setLoading(false);
      setSuccess(data.success);
      setProduct(data.product);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (success) {
      navigate("/admin/products");
      toast.success("Product Added", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, success]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      stock: "",
      seller: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("category", values.category);
      formData.set("price", values.price);
      formData.set("stock", values.stock);
      formData.set("description", values.description);
      formData.set("seller", values.seller);

      // Add your image handling logic here (images are not declared in the code)
      images.forEach((image) => {
        formData.append("images", image);
      });

      newProduct(formData);
    },
  });

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };


  return (
    <Fragment>
      <MetaData title={"New Product"} />
      <div className="row">
        <div className="col-12 col-md-2">{/* <Sidebar /> */}</div>

        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <form
                className="shadow-lg"
                onSubmit={formik.handleSubmit}
                encType="multipart/form-data"
              >
                <h1 className="mb-4">Add Product</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-danger">{formik.errors.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    id="description_field"
                    className="form-control"
                    {...formik.getFieldProps("description")}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-danger">{formik.errors.description}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    className="form-control"
                    id="category_field"
                    {...formik.getFieldProps("category")}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <div className="text-danger">{formik.errors.category}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="number_field">Price</label>
                  <input
                    type="number"
                    id="number_field"
                    className="form-control"
                    {...formik.getFieldProps("price")}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-danger">{formik.errors.price}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="number_field">Stock</label>
                  <input
                    type="number"
                    id="number_field"
                    className="form-control"
                    {...formik.getFieldProps("stock")}
                  />
                  {formik.touched.stock && formik.errors.stock && (
                    <div className="text-danger">{formik.errors.stock}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Seller
                  </label>
                  <select
                    className="form-control"
                    id="category"
                    name="category"
                    required
                    {...formik.getFieldProps("seller")}
                  >
                    {supplier.map((suppliers) => (
                      <option key={suppliers._id} value={suppliers._id}>
                        {suppliers.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.seller && formik.errors.seller && (
                    <div className="text-danger">{formik.errors.seller}</div>
                  )}
                </div>

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

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                // disabled={loading ? true : false}
                >
                  CREATE
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};
export default NewProduct;
