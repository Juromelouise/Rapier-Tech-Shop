import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { mainListItems } from "./ListItems";
import { Button, Box, Toolbar } from "@mui/material";

export default function ProductList() {
  const [product, setProduct] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const fetchProducts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/products/`,
        config
      );
      setProduct(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const deleteProductHandler = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/admin/product/${id}`,
        config
      );

      // Filter out the deleted product from the current state
      const updatedProduct = product.filter((item) => item._id !== id);

      // Update the state with the new product array
      setProduct(updatedProduct);

      // Set other state variables as needed
      setIsDeleted(true);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        {/* Navigation Bar */}
        <List component="nav">{mainListItems}</List>

        {/* Main content */}
        <div style={{ flexGrow: 1, padding: "20px" }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Title>Products</Title>
            </Box>
          </Toolbar>
          <Divider />
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
                        style={{ width: "100px", height: "100px" }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Link to="/admin/product/new">
                      <Button variant="contained" color="primary">
                        Add Product
                      </Button>
                    </Link>
                    <Link to={`/admin/product/${row._id}`}>
                      <Button variant="contained" color="primary">
                        Edit
                      </Button>
                    </Link>
                    <button
                      className="btn btn-danger py-1 px-2 ml-2"
                      onClick={() => deleteProductHandler(row._id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </React.Fragment>
  );
}
