import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
// import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [images, setImage] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')

  let navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set('avatar', avatar);

    newUser(formData);
  };

  const onAvatarChange = (e) => {
    const file = e.target.files[0]; // Get only the first file (single image)
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result); // Set the avatar as the preview
        setAvatarPreview(reader.result); // Set the avatar as the preview (if needed)
      }
    };

    if (file) {
      reader.readAsDataURL(file);
      setAvatar(file); // Set the avatar as the file object
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
                <h1 className="mb-4">Add User</h1>

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
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="text"
                    id="email_field"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
                    <label className="custom-file-label" htmlFor="customAvatarFile">
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
export default NewUser;
