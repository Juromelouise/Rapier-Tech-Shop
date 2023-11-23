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

    const [user, setUsers] = useState([])
    const users = async () => {
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }
        try {
            let res = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/all/user`, config)
            console.log(res)
            setUsers(res.data.users)
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    useEffect(() => {
        users()
    }, [])

    console.log(user)
    return (
        <React.Fragment>
            <Title>Users</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Profile Img.</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {user.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.avatar && (
                                    <img
                                        src={row.avatar.url}
                                        alt={row.avatar.public_id}
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                )}
                            </TableCell>
                            <TableCell>{row.email}</TableCell>
                            {/* <TableCell align="right">{`$${row.amount}`}</TableCell> */}
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