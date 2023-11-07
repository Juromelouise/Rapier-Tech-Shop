//De Jesus
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
const products = require('./routes/product');

app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', products);



module.exports = app