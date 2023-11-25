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
import List from '@mui/material/List';
import { mainListItems } from './ListItems';

function preventDefault(event) {
  event.preventDefault();
}

export default function SupplierList() {
  const [supplier, setSupplier] = useState([]);
  const [error, setError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

  const supplies = async () => {
    const config = {
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/supplier`,
        config
      );
      setSupplier(res.data.supplier);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteSupplierHandler = async (id) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getToken()}`
        }
      };
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/supplier/${id}`, config);

      // Filter out the deleted supplier from the current state
      const updatedSupplier = supplier.filter(supplier => supplier._id !== id);

      // Update the state with the new supplier array
      setSupplier(updatedSupplier);

      // Set other state variables as needed
      setIsDeleted(true);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };


  useEffect(() => {
    supplies();
  }, []);

  console.log(supplier);
  return (
    <React.Fragment>
      <Title>Suppliers</Title>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {supplier.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                {row.images.map((row) => (
                  <img key={row.public_id}
                    src={row.url}
                    alt={row.public_id}
                    style={{ width: '100px', height: '100px' }} />
                ))}
              </TableCell>
              <TableCell>{row.number}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
              <TableCell>
                <Link to={`/admin/supplier/${row._id}`} className="btn btn-primary py-1 px-2">
                  <i className="fa fa-pencil"></i>
                </Link>

                <button
                  className="btn btn-danger py-1 px-2 ml-2"
                  onClick={() => deleteSupplierHandler(row._id)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </TableCell>
              {/* <TableCell align="right">{`$${row.amount}`}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* <Link color="primary" onClick={preventDefault} sx={{ mt: 3 }}> */}
      <Link to="/admin/supplier/new" sx={{ mt: 3 }}>
        Add Supplier
      </Link>
      {/* </Link> */}
    </React.Fragment>
  );
}
