import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import axios from "axios";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/helpers";

function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
  const [orders, setOrder] = useState([]);
  const orderss = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/orders/`,
        config
      );
      setOrder(res.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    orderss();
  }, []);

  console.log(orders);
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.createdAt}</TableCell>
              {/* <TableCell>{row.name}</TableCell> */}
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.shippingInfo.address}</TableCell>
              <TableCell>{row.paymentMethod}</TableCell>
              <TableCell align="right">{`$${row.totalPrice}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="/admin/dashboard" onClick={preventDefault} sx={{ mt: 3 }}>
        Go Back to Dashboard
      </Link>
    </React.Fragment>
  );
}
