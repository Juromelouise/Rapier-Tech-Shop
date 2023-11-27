import React, { useState, useEffect } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import Loader from '../Layout/Loader';

export default function Chart1Component() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchChartData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/chart1`, config);
      setChartData(data.chartData);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <ResponsiveContainer width="90%" height={600}>
      {loading ? (
        <Loader />
      ) : (
        <BarChart width={600} height={300} data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Bar dataKey="totalOrders" fill="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
