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
      <Title>Orders</Title>
      <Table>
      <TableHead>
        <TableRow>
          <TableCell>Order ID</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Order Status</TableCell>
          <TableCell>Total Price</TableCell>
          <TableCell>User Name</TableCell>
          <TableCell align="right">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>{order._id}</TableCell>
            <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
            <TableCell>{order.orderStatus}</TableCell>
            <TableCell>{order.totalPrice}</TableCell>
            <TableCell>{order.user.name}</TableCell>
            <TableCell align="right">
              {/* Add any actions you want to perform for each order */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

      {/* Additional details for each order */}
      
    </React.Fragment>
  );

}
