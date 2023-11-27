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
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string().required("Password is required"),
  role: Yup.string().required("Role is required"),
});

const NewUser = () => {
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({});
  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.set("name", values.name);
      formData.set("email", values.email);
      formData.set("password", values.password);
      formData.set("avatar", avatar);
      formData.set("role", values.role);

      newUser(formData);
    },
  });

  const onAvatarChange = (e) => {
    const file = e.target.files[0]; // Get only the first file (single image)
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const newUser = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/admin/new/user`,
        formData,
        config
      );
      setLoading(false);
      setSuccess(data.success);
      setUser(data.user);
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
      navigate("/admin/user");
      toast.success("User Added", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }, [error, success]);

  return (
    <Fragment>
      <MetaData title={"New User"} />
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
                <h1 className="mb-4">Add User</h1>

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
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger">{formik.errors.password}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="text"
                    id="email_field"
                    className="form-control"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger">{formik.errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="name_field">Role</label>
                  <select
                    id="name_field"
                    className="form-control"
                    {...formik.getFieldProps("role")}
                  >
                    <option value="user">Normal User</option>
                    <option value="admin">Administrator</option>
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <div className="text-danger">{formik.errors.role}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Avatar</label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="avatar"
                      className="custom-file-input"
                      id="customAvatarFile"
                      onChange={onAvatarChange}
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="customAvatarFile"
                    >
                      Choose Avatar
                    </label>
                  </div>

                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="mt-3 mr-2"
                      width="55"
                      height="52"
                    />
                  )}
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

export default NewUser;
