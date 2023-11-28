import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import Title from "./Title";
import axios from "axios";
import { getToken } from "../../utils/helpers";
import List from "@mui/material/List";
import { mainListItems } from "./ListItems";
import { Button, Typography } from "@mui/material";

export default function SupplierList() {
  const [supplier, setSupplier] = useState([]);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const supplies = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    };
    try {
      let res = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/supplier`,
        config
      );
      setSupplier(res.data.supplier);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      setError("Error fetching suppliers");
    }
  };

  const deleteSupplierHandler = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/admin/supplier/${id}`,
        config
      );

      const updatedSupplier = supplier.filter(
        (supplier) => supplier._id !== id
      );
      setSupplier(updatedSupplier);

      setIsDeleted(true);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  useEffect(() => {
    supplies();
  }, []);

  const data = {
    columns: [
      {
        label: "Name",
        field: "name",
        sort: "asc",
      },
      {
        label: "Images",
        field: "images",
        sort: "asc",
      },
      {
        label: "Number",
        field: "number",
        sort: "asc",
      },
      {
        label: "Address",
        field: "address",
        sort: "asc",
      },
      {
        label: "Date",
        field: "createdAt",
        sort: "asc",
      },
      {
        label: "Action",
        field: "action",
      },
    ],
    rows: supplier.map((row) => ({
      name: row.name,
      images: row.images.map((image) => (
        <img
          key={image.public_id}
          src={image.url}
          alt={image.public_id}
          style={{ width: "100px", height: "100px" }}
        />
      )),
      number: row.number,
      address: row.address,
      createdAt: row.createdAt,
      action: (
        <Fragment>
          
          <Link to={`/admin/supplier/${row._id}`}>
          <button className="edit-btn">Edit</button>
          </Link>
          <br/>
          <br/> 
          <Link
                onClick={() => deleteSupplierHandler(row._id)}>
                <button className="delete-btn">Delete</button>
                </Link>
          
        </Fragment>
        
      ),
    })),
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <List component="nav">{mainListItems}</List>

      {/* Main content */}
      <div className="col-12 col-md-10">
      <p className="star">ALL SUPPLIER</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          
          <MDBDataTable
            data={data}
            searching={false}
            className="design"
            bordered
            striped
            hover
            responsive
          />
        )}
        <Link to="/admin/supplier/new" style={{ marginTop: "1rem" }}>
          <Button
          
          component={Link}
              to="/admin/supplier/new"
              className="que"
              sx={{
                mt: 3,
                color: 'white',
                backgroundColor: 'black',
                transition: 'color 0.3s, background-color 0.3s', 
                margin: '20px 30px',
                padding: '15px',
                '&:hover': {
                  color: 'white', // Text color on hover
                  backgroundColor: 'gray', // Background color on hover
                },
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
            Add Supplier
          </Button>
        </Link>
      </div>
    </div>
  );
}