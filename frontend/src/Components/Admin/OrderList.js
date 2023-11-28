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
import { mainListItems, secondaryListItems } from './ListItems';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';


function preventDefault(event) {
  event.preventDefault();
}

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [deleteError, setDeleteError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

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

  const deleteOrderHandler = async (id) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getToken()}`
        }
      };
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/order/${id}`, config);

      // Filter out the deleted supplier from the current state
      const updatedOrder = orders.filter(orders => orders._id !== id);

      // Update the state with the new supplier array
      setOrders(updatedOrder);

      // Set other state variables as needed
      setIsDeleted(true);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
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
      console.log('yey')
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
      <div style={{ display: 'flex' }}>
        {/* Navigation Bar */}
        <List component="nav">
          {mainListItems}
          <Divider sx={{ my: 1 }} />
        </List>

        {/* Main content */}
        <div style={{ flexGrow: 1, padding: '20px' }}>
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
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{order.orderStatus}</TableCell>
                  <TableCell>{order.totalPrice}</TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>
                    {order.orderStatus !== 'Delivered' && (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleUpdateStatus(order._id)}
                      >
                        CONFIRM
                      </Button>
                    )}
                    {order.orderStatus === 'Processing' && 
                    (<button
                      className="btn btn-danger py-1 px-2 ml-2"
                      onClick={() => deleteOrderHandler(order._id)}
                    >
                      CANCEL ORDER
                    </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Orders;
