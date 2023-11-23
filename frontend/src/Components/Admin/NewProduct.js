import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../Layout/Metadata";
// import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewProduct = () => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const [images, setImage] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [product, setProduct] = useState({});

    const categories = [
        "Laptop",
        "Phone",
        "Smartwatch",
        "Speaker",
        "Headphone",
        "Earphone",
        "Console",
    ]

    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("category", category);
        formData.set("price", price);
        formData.set("stock", stock);

        images.forEach((image) => {
            formData.append("images", image);
        });

        newProduct(formData);
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
            setProduct(data.supplier);
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
            navigate("/admin/product");
            toast.success("Product Added", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    }, [error, success]);

    return (
        <Fragment>
            <MetaData title={"New Product"} />
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
                                <h1 className="mb-4">Add Product</h1>

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
                                    <label htmlFor="category_field">Category</label>
                                    <select className="form-control" id="category_field" value={category} onChange={(e) => setCategory(e.target.value)}>
                                        {categories.map(category => (
                                            <option key={category} value={category} >{category}</option>
                                        ))}

                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="number_field">Price</label>
                                    <input
                                        type="number"
                                        id="number_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="number_field">Stock</label>
                                    <input
                                        type="number"
                                        id="number_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
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
