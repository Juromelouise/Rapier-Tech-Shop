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

export default function SupplierList() {
  const [supplier, setSupplier] = useState([]);
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

  useEffect(() => {
    supplies();
  }, []);

  console.log(supplier);
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Images</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Date</TableCell>
            {/* <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {supplier.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row._id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                {row.images.map((row) => (
                  <img key={row.public_id} src={row.url} alt={row.public_id}/>
                ))}
              </TableCell>
              <TableCell>{row.number}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{row.createdAt}</TableCell>
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
