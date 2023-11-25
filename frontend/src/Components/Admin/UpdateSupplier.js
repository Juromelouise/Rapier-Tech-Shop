import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../Layout/Metadata'
// import Sidebar from './SideBar'

import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import { getToken } from '../../utils/helpers';


const UpdateSupplier = () => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [supplier, setSupplier] = useState({});
    const [updateError, setUpdateError] = useState('')
    const [isUpdated, setIsUpdated] = useState(false)
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);


    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });
    const successMsg = (message = '') => toast.success(message, {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const getSupplierDetails = async (id) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/singleSupplier/${id}`)
            setSupplier(data.supplier)
            setLoading(false)

        } catch (error) {
            setError(error.response.data.message)

        }
    }

    const updateSupplier = async (id, supplierData) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/admin/supplier/${id}`, supplierData, config)
            setIsUpdated(data.success)

        } catch (error) {
            setUpdateError(error.response.data.message)

        }
    }
    useEffect(() => {
        if (supplier && supplier._id !== id) {
            getSupplierDetails(id)
        } else {
            setName(supplier.name);
            setNumber(supplier.number);
            setAddress(supplier.address);
            setImage(supplier.image);

        }
        if (error) {
            errMsg(error)

        }
        if (updateError) {
            errMsg(updateError);

        }
        if (isUpdated) {
            navigate('/admin/supplier');
            successMsg('Supplier updated successfully');

        }
    }, [error, isUpdated, updateError, supplier, id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('number', number);
        formData.set('address', address);

        images.forEach(image => {
            formData.append('images', image)
        })
        updateSupplier(supplier._id, formData)
    }
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
            <MetaData title={'Update Supplier'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {/* <Sidebar /> */}
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">Update Supplier</h1>
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

export default UpdateSupplier