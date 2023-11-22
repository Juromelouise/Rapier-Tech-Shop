import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
// import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewSupplier = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImage] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [supplier, setSupplier] = useState({});

  let navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("number", number);
    formData.set("address", address);

    images.forEach((image) => {
      formData.append("images", image);
    });

    newSupplier(formData);
  };

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
      // console.log(reader)
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
        <div className="col-12 col-md-2">
          {/* <Sidebar /> */}
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <form
                className="shadow-lg"
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >
                <h1 className="mb-4">Add Supplier</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="number_field">Phone Number</label>
                  <input
                    type="number"
                    id="number_field"
                    className="form-control"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address_field">Address</label>
                  <textarea
                    className="form-control"
                    id="address_field"
                    rows="8"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
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
export default NewSupplier;
