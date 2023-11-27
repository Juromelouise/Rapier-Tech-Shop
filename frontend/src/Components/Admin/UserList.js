import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { mainListItems } from './ListItems';
import axios from 'axios';
import { getToken } from '../../utils/helpers';
import Title from './Title';

export default function UserList() {
  const [user, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const getUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/all/user`,
        config
      );
      setUsers(res.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response.data.message);
    }
  };

  const deleteUserHandler = async (id) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      };
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/admin/user/${id}`,
        config
      );

      const updatedUsers = user.filter((user) => user._id !== id);
      setUsers(updatedUsers);

      setIsDeleted(true);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const data = {
    columns: [
      {
        label: 'Name',
        field: 'name',
        sort: 'asc',
      },
      {
        label: 'Profile Img.',
        field: 'avatar',
        sort: 'asc',
      },
      {
        label: 'Role',
        field: 'role',
        sort: 'asc',
      },
      {
        label: 'Email',
        field: 'email',
        sort: 'asc',
      },
      {
        label: 'Action',
        field: 'action',
      },
    ],
    rows: user.map((row) => ({
      name: row.name,
      avatar: row.avatar && (
        <img
          src={row.avatar.url}
          alt={row.avatar.public_id}
          style={{ width: '100px', height: '100px' }}
        />
      ),
      role: row.role,
      email: row.email,
      action: (
        <Fragment>
          <Link to={`/admin/user/update/${row._id}`} style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Link>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteUserHandler(row._id)}
            style={{ marginLeft: '8px' }}
          >
            Delete
          </Button>
        </Fragment>
      ),
    })),
  };

  return (
    <Fragment>
      <MetaData title={'All User'} />
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <List component="nav">
          {mainListItems}
          <Divider sx={{ my: 1 }} />
        </List>

        {/* Main content */}
        <div className="col-12 col-md-10">
        <h2>All User</h2>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={data}
              searching={false}
              bordered
              striped
              hover
            />
          )}
          <Button
            component={Link}
            to="/admin/user/new"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Add User
          </Button>
        </div>
      </div>
    </Fragment>
  );
}