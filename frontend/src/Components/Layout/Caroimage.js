import React from "react";
import { Carousel } from "react-bootstrap";

const Caroimage = ({ prod }) => {
  const imageHeight = "400px"; // Set your desired fixed height

  return (
    <div className="caro-container" style={{ height: imageHeight }}>
      {prod && prod.images.length > 0 ? (
        <Carousel pause="hover">
          {prod.images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 carousel-image"
                src={image.url}
                alt={prod.title}
                style={{ height: "100%", objectFit: "cover" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>No images available for this product.</p>
      )}
    </div>
  );
};

export default Caroimage;