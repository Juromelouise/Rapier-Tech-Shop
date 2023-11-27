import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label,ReferenceLine  } from 'recharts';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import Loader from '../Layout/Loader';

export default function Chart2Component() {
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

      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/chart2`, config);
      console.log(data);
      setChartData(data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data.message || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Sales Per User</h2>
      <ResponsiveContainer width="90%" height={600}>
        {loading ? (
          <Loader />
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="totalAmount"
              cx="50%"
              cy="50%"
              outerRadius={200}
              fill="#8884d8"
              label={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`$${value}`, `User: ${props.payload.userName}`]} />
            <Legend
              align="right"
              verticalAlign="middle"
              layout="vertical"
              formatter={(value, entry) => entry.payload.userName}
            />
            <Label value="Sales Per User" position="top" offset={-10} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
