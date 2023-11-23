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



function preventDefault(event) {
  event.preventDefault();
}

export default function ProductList() {

  const [product, setProduct] = useState([])
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
            <TableCell align="right">Action</TableCell>
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
                    style={{ width: '100px', height: 'auto' }}
                  />
                ))}
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