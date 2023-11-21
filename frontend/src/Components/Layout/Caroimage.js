import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const [product, setProduct] = useState({});

const image = ()=> {
    let res = axios.get(`${process.env.REACT_APP_API}/api/v1/products`)
    console.log(res)
    setProduct(response.data.product)
} 

const Caroimage = () => {
  return <div>Caroimage</div>;
};

export default Caroimage;
