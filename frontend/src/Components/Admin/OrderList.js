import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button"; // Import Button component from MUI
import Title from "./Title";
import axios from "axios";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/helpers";

function preventDefault(event) {
  event.preventDefault();
}

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/orders/`,
        config
      );

      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleUpdateStatus = async (orderId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };

    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/admin/order/${orderId}`,
        { status: 'Delivered' },
        config
      );

      // After updating the status, fetch the updated orders
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
            <TableCell>Action</TableCell>
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
              <TableCell>
                {order.orderStatus !== "Delivered" && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleUpdateStatus(order._id)}
                  >
                    To Shipped
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
};

export default Orders;
