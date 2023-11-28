import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../Layout/Metadata';
import Loader from '../Layout/Loader';
// import Sidebar from './SideBar';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mainListItems, secondaryListItems } from './ListItems';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';


const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  let navigate = useNavigate();

  const getAdminProducts = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      };

      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/products`, config);
      console.log(data);
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      // setError(error.response.data.message);
    }
  };

  useEffect(() => {
    getAdminProducts();

    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }

    if (deleteError) {
      toast.error(deleteError, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }

    if (isDeleted) {
      toast.success('Product deleted successfully', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      navigate('/admin/products');
    }
  }, [error, deleteError, isDeleted]);;

  const deleteProduct = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/product/${id}`, config);

      setIsDeleted(data.success);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  const productsList = () => {
    const data = {
      columns: [
        {
          label: 'ID',
          field: 'id',
          sort: 'asc'
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc'
        },
        {
          label: 'Price',
          field: 'price',
          sort: 'asc'
        },
        {
          label: 'Stock',
          field: 'stock',
          sort: 'asc'
        },
        {
          label: 'Actions',
          field: 'actions',
        },
      ],
      rows: []
    };

    products.forEach(product => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: <Fragment>
          <Link to={`/admin/product/${product._id}`}>
          <button className="edit-btn">Edit</button>
          </Link>
          <Link
                onClick={() => deleteProductHandler(product._id)}>
                <button className="delete-btn">Delete</button>
                </Link>
          
        </Fragment>
      });
    });

    return data;
  };

  const deleteProductHandler = (id) => {
    deleteProduct(id);
  };

  return (
    <Fragment>
      <MetaData title={'All Products'} />
      <div style={{ display: 'flex' }} >
        {/* Sidebar */}
        <List component="nav">
          {mainListItems}
          <Divider sx={{ my: 1 }} />
        </List>

        {/* Main content */}
        <div className="col-12 col-md-10">
          <Fragment>
            <p className="star">ALL PRODUCTS</p>
            {loading ? <Loader /> : (
              <div className="custom-mdb-table">
              <MDBDataTable
                data={productsList()}
                className="custom-mdb-table"
                bordered
                striped
                hover
               
              />
              </div>
            )}
            <Button
              component={Link}
              to="/admin/product/new"
              className="AddProduct-btn"
              sx={{
                mt: 3,
                color: 'white',
                backgroundColor: 'black',
                transition: 'color 0.3s, background-color 0.3s', 
                margin: '20px 30px',
                padding: '15px',
                '&:hover': {
                  color: 'white', // Text color on hover
                  backgroundColor: 'gray', // Background color on hover
                },
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Add Product
            </Button>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductsList;
