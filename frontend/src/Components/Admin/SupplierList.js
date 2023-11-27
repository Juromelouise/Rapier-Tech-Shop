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
          <Link
            to={`/admin/supplier/${row._id}`}
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Link>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteSupplierHandler(row._id)}
            style={{ marginLeft: "8px" }}
          >
            Delete
          </Button>
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
      <h2>All Supplier</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <MDBDataTable
            data={data}
            searching={false}
            bordered
            striped
            hover
            responsive
          />
        )}
        <Link to="/admin/supplier/new" style={{ marginTop: "1rem" }}>
          <Button variant="contained" color="primary">
            Add Supplier
          </Button>
        </Link>
      </div>
    </div>
  );
}