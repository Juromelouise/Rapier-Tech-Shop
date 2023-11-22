import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const Caroimage = ({ prod }) => {
  console.log(prod)
  return (
    <div>
      <Carousel pause="hover">
        {prod &&
          prod.images.map((image, index) => (
            <Carousel.Item key={index}>
              <img className="d-block w-100" src={image.url} alt={prod.title} />
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
};

export default Caroimage;
