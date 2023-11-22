import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const Caroimage = ({prod}) => {

  return <div>
                     <Carousel pause="hover">
                      {prod.images &&
                        prod.images.map((image) => (
                          <Carousel key={image.public_id}>
                            <img
                              className="d-block w-100"
                              src={image.url}
                              alt={prod.title}
                            />
                          </Carousel>
                        ))}
                    </Carousel>
  </div>;
};

export default Caroimage;
