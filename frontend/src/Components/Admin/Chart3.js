import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import Loader from '../Layout/Loader';

export default function Chart3() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const monthlySales = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/chart3`, config);
      setSales(data.chartData);
      console.log(data.chartData);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    monthlySales();
  }, []);

  return (
    <ResponsiveContainer width="90%" height={600}>
      <h2 style={{ textAlign: 'center' }}>Monthly Sales</h2>
      <LineChart width={600} height={300} data={sales} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="total" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip labelFormatter={(value) => `Month: ${value}`} formatter={(value) => [`Total: ${value}`]} />
      </LineChart>
    </ResponsiveContainer>
  );
}