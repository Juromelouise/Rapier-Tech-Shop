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

export default function UserList() {
  const [user, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const users = async () => {
    const config = {
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/all/user`,
        config
      );
      console.log(res);
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const deleteUserHandler = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/admin/user/${id}`,
        config
      );

      // Filter out the deleted supplier from the current state
      const updatedUsers = user.filter((user) => user._id !== id);

      // Update the state with the new supplier array
      setUsers(updatedUsers);

      // Set other state variables as needed
      setIsDeleted(true);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  useEffect(() => {
    users();
  }, []);

  console.log(user);
  return (
    <React.Fragment>
      <Title>Users</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Profile Img.</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                {row.avatar && (
                  <img
                    src={row.avatar.url}
                    alt={row.avatar.public_id}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
              </TableCell>
              <TableCell>{row.role}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                <Link
                  to={`/admin/user/update/${row._id}`}
                >
                  <button>Edit</button>
                </Link>
                <button
                  className="btn btn-danger py-1 px-2 ml-2"
                  onClick={() => deleteUserHandler(row._id)}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link to="/admin/user/new" sx={{ mt: 3 }}>
        Add User
      </Link>
    </React.Fragment>
  );
}
