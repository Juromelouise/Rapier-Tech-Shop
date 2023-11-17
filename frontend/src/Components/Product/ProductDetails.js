import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import Loader from "../Layout/Loader";
import MetaData from "../Layout/Metadata";
import { getUser, getToken, successMsg, errMsg } from "../../utils/helpers";
// import ListReviews from '../Review/ListReviews'
// import { useAlert} from '@blaumaus/react-alert'
import axios from "axios";

const ProductDetails = ({ cartItems, addItemToCart }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [user, setUser] = useState(getUser());
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errorReview, setErrorReview] = useState("");
  const [success, setSuccess] = useState("");

  let { id } = useParams();
  // const alert = useAlert();

  const productDetails = async (id) => {
    // let link = `http://localhost:4001/api/v1/product/${id}`
    // console.log(link)
    let res = await axios.get(
      `http://localhost:4001/api/v1/singleProduct/${id}`
    );
    console.log(res);
    if (!res) setError("Product not found");
    setProduct(res.data.products);
    setLoading(false);
  };

  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= product.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const addToCart = async () => {
    await addItemToCart(id, quantity);
  };
  // function setUserRatings() {
  //     const stars = document.querySelectorAll('.star');
  //     stars.forEach((star, index) => {
  //         star.starValue = index + 1;
  //         ['click', 'mouseover', 'mouseout'].forEach(function (e) {
  //             star.addEventListener(e, showRatings);
  //         })
  //     })
  //     function showRatings(e) {
  //         stars.forEach((star, index) => {
  //             if (e.type === 'click') {
  //                 if (index < this.starValue) {
  //                     star.classList.add('orange');
  //                     setRating(this.starValue)
  //                 } else {
  //                     star.classList.remove('orange')
  //                 }
  //             }
  //             if (e.type === 'mouseover') {
  //                 if (index < this.starValue) {
  //                     star.classList.add('yellow');
  //                 } else {
  //                     star.classList.remove('yellow')
  //                 }
  //             }
  //             if (e.type === 'mouseout') {
  //                 star.classList.remove('yellow')
  //             }
  //         })
  //     }
  // }

  // const newReview = async (reviewData) => {
  //     try {
  //         const config = {
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 'Authorization': `Bearer ${getToken()}`
  //             }
  //         }

  //         const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/review`, reviewData, config)
  //         setSuccess(data.success)

  //     } catch (error) {
  //         setErrorReview(error.response.data.message)
  //     }
  // }

  // const reviewHandler = () => {
  //     const formData = new FormData();
  //     formData.set('rating', rating);
  //     formData.set('comment', comment);
  //     formData.set('productId', id);
  //     newReview(formData)

  // }

  useEffect(() => {
    productDetails(id);
    // if (errorReview) {
    //     errMsg(errorReview)
    //     setErrorReview('')
    // }
    // if (success) {
    //     successMsg('Review posted successfully')
    //     setSuccess(false)

    // }
  }, [id, error, errorReview, success]);

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name} />
          <div className="body1"></div>
          <main>
            <div className="card1">
              <div className="card__title">
                <div className="icon">
                  <i className="fa fa-arrow-left"></i>
                </div>
                <h3>New products</h3>
              </div>
              <div className="card__body">
                <div className="half">
                  <div className="featured_text">
                    <h1>{product.name}</h1>
                    <p className="sub">{product.category}</p>
                    <p className="price">${product.price}</p>
                  </div>
                  <div className="image">
                    <Carousel pause="hover">
                      {product.images &&
                        product.images.map((image) => (
                          <Carousel.Item key={image.public_id}>
                            <img
                              className="d-block w-100"
                              src={image.url}
                              alt={product.title}
                            />
                          </Carousel.Item>
                        ))}
                    </Carousel>
                  </div>
                </div>
                <div className="half">
                  <div className="description">
                    <p>{product.description}</p>
                  </div>
                  <span className="stock">
                    <i className="fa fa-pen"></i> In stock
                  </span>
                  <div className="reviews">
                    <ul className="stars">
                      <li>
                        <i className="fa fa-star"></i>
                      </li>
                      <li>
                        <i className="fa fa-star"></i>
                      </li>
                      <li>
                        <i className="fa fa-star"></i>
                      </li>
                      <li>
                        <i className="fa fa-star"></i>
                      </li>
                      <li>
                        <i className="fa fa-star-o"></i>
                      </li>
                    </ul>
                    <span>Reviews: {product.numOfReviews}</span>
                  </div>
                </div>
              </div>
              <div className="card__footer">
                <div className="recommend">
                  <p>Recommended by</p>
                  <h3>Andrew Palmer</h3>
                </div>
                <div className="action">
                  <div className="stockCounter d-inline">
                    <span
                      className="btn btn-danger minus"
                      onClick={decreaseQty}
                    >
                      -
                    </span>

                    <input
                      type="number"
                      className="form-control count d-inline"
                      value={quantity}
                      readOnly
                    />
                    {/* <span className="btn btn-primary plus"> +</span> */}
                    <span
                      className="btn btn-primary plus"
                      onClick={increaseQty}
                    >
                      +
                    </span>
                  </div>
                  <button
                    type="button"
                    id="cart_btn"
                    className="btn btn-primary d-inline ml-4"
                    disabled={product.stock === 0}
                    onClick={addToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </main>
        </Fragment>
      )}
    </Fragment>
  );
};
export default ProductDetails;
