import * as React from "react";
// import Link from '@mui/material/Link';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import axios from "axios";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/helpers";
import { Link } from "react-router-dom";
import { Row } from "react-bootstrap";

function preventDefault(event) {
  event.preventDefault();
}

export default function ProductList() {

  const [product, setProduct] = useState([])
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

  const products = async () => {
    const config = {
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    }
    try {
      let res = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/products/`, config)
      console.log(res)
      setProduct(res.data.products)
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }

  const deleteProductHandler = async (id) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getToken()}`
        }
      };
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/product/${id}`, config);

      // Filter out the deleted supplier from the current state
      const updatedProduct = product.filter(product => product._id !== id);

      // Update the state with the new supplier array
      setProduct(updatedProduct);

      // Set other state variables as needed
      setIsDeleted(true);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  useEffect(() => {
    products()
  }, [])

  // console.log(product)
  return (
    <React.Fragment>
      <Title>Products</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {product.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.stock}</TableCell>
              <TableCell>
                {row.images.map((image) => (
                  <img
                    key={image.public_id}
                    src={image.url}
                    alt={image.public_id}
                    style={{ width: '100px', height: '100px' }}
                  />
                ))}
              </TableCell>
              <TableCell>
                <Link to={`/admin/product/${row._id}`} className="btn btn-primary py-1 px-2">
                  <i className="fa fa-pencil"></i>
                </Link>
                <button
                  className="btn btn-danger py-1 px-2 ml-2"
                  onClick={() => deleteProductHandler(row._id)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </TableCell>
              {/* <TableCell align="right">{`$${row.amount}`}</TableCell> */}
            </TableRow>

          ))}
        </TableBody>
      </Table>
      <Link to="/admin/product/new" sx={{ mt: 3 }}>
        Add Product
      </Link>
    </React.Fragment>

  );
}