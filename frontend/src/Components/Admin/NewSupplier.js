import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
// import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  number: Yup.string().required("Phone Number is required"),
  address: Yup.string().required("Address is required"),
});

const NewSupplier = () => {
  const [images, setImage] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [supplier, setSupplier] = useState({});
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      number: "",
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("number", values.number);
      formData.set("address", values.address);

      images.forEach((image) => {
        formData.append("images", image);
      });

      newSupplier(formData);
    },
  });

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImage([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImage((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const newSupplier = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/admin/new/supplier`,
        formData,
        config
      );
      setLoading(false);
      setSuccess(data.success);
      setSupplier(data.supplier);
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
      navigate("/admin/supplier");
      toast.success("Supplier added", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, success]);

  return (
    <Fragment>
      <MetaData title={"New Supplier"} />
      <div className="row">
        <div className="col-12 col-md-2"></div>

        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <form
                className="shadow-lg"
                onSubmit={formik.handleSubmit}
                encType="multipart/form-data"
              >
                <h1 className="mb-4">Add Supplier</h1>

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
                  <label htmlFor="number_field">Phone Number</label>
                  <input
                    type="text"
                    id="number_field"
                    className="form-control"
                    {...formik.getFieldProps("number")}
                  />
                  {formik.touched.number && formik.errors.number && (
                    <div className="text-danger">{formik.errors.number}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address_field">Address</label>
                  <textarea
                    className="form-control"
                    id="address_field"
                    rows="8"
                    {...formik.getFieldProps("address")}
                  ></textarea>
                  {formik.touched.address && formik.errors.address && (
                    <div className="text-danger">{formik.errors.address}</div>
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

export default NewSupplier;
