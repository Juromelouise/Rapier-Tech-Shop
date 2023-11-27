import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../Layout/Metadata'
// import Sidebar from './SideBar'
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import { getToken } from '../../utils/helpers';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().required('Price is required'),
    stock: Yup.number().required('Stock is required'),
    seller: Yup.string().required('Seller is required'),
});

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(true)
    const [updateError, setUpdateError] = useState('')
    const [isUpdated, setIsUpdated] = useState(false)
    const [seller, setSeller] = useState('');
    const [supplier, setSupplier] = useState([]);
    const [fileSelected, setFileSelected] = useState(false);

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

    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const getProductDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/singleProduct/${id}`)
            setProduct(data.products)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)

        }
    }

    const getSupplier = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${getToken()}`
            },
        };
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/supplier`, config)
        // console.log(data.supplier);
        setSupplier(data.supplier)
    }
    useEffect(() => {
        getSupplier()
    }, [])

    const updateProduct = async (id, productData) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/update/product/${id}`, productData, config)
            setIsUpdated(data.success)

        } catch (error) {
            setUpdateError(error.response.data.message)

        }
    }
    useEffect(() => {
        if (product && product._id !== id) {
            getProductDetails(id);
        } else {
            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setStock(product.stock);
            setOldImages(product.images);
            setSeller(product.seller);
        }
        if (error) {
            errMsg(error)
        }
        if (updateError) {
            errMsg(updateError);
        }
        if (isUpdated) {
            navigate('/admin/products');
            successMsg('Product updated successfully');
        }
    }, [error, isUpdated, updateError, product, id]);

    const formik = useFormik({
        initialValues: {
            name: product.name || '',
            category: product.category || '',
            price: product.price || 0,
            stock: product.stock || 0,
            seller: product.seller || '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.set('name', values.name);
            formData.set('category', values.category);
            formData.set('price', values.price);
            formData.set('stock', values.stock);
            formData.set('seller', values.seller);

            // Add your image handling logic here (images are not declared in the code)
            images.forEach((image) => {
                formData.append('images', image);
            });

            updateProduct(product._id, formData);
        },
    });

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        setOldImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }
            reader.readAsDataURL(file)
        })
    }
    return (
        <Fragment>
            <MetaData title={'Update Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {/* <Sidebar /> */}
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={formik.handleSubmit} encType='multipart/form-data'>
                                <h1 className="mb-4">Update Product</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name && <div className="invalid-feedback">{formik.errors.name}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select
                                        id="category_field"
                                        className={`form-control ${formik.touched.category && formik.errors.category ? 'is-invalid' : ''}`}
                                        {...formik.getFieldProps('category')}
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    {formik.touched.category && formik.errors.category && <div className="invalid-feedback">{formik.errors.category}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Price</label>
                                    <input
                                        type="text"
                                        id="price_field"
                                        className="form-control"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="stock_field">Stock</label>
                                    <input
                                        type="number"
                                        id="stock_field"
                                        className="form-control"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="suppliers" className="form-label">
                                        Seller
                                    </label>
                                    <select
                                        className="form-control"
                                        id="suppliers"
                                        name="suppliers"
                                        required
                                        value={seller}
                                        onChange={(e) => setSeller(e.target.value)}
                                    >
                                        {supplier.map((suppliers) => (
                                            <option key={suppliers._id} value={suppliers._id}>
                                                {suppliers.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='form-group'>
                                    <label>Images</label>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Images
                                        </label>
                                    </div>
                                    {oldImages && oldImages.map(img => (
                                        <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}
                                </div>
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
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProduct