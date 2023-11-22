import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const Caroimage = () => {
  const [product, setProduct] = useState({});

  const image = ()=> {
      let res = axios.get(`${process.env.REACT_APP_API}/api/v1/image`)
      console.log(res)
      setProduct(res.data.products)
  } 
  
  useEffect(()=>{
    image()
  },[])

  return <div>Caroimage</div>;
};

export default Caroimage;
