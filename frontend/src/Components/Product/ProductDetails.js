import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import Loader from "../Layout/Loader";
import MetaData from "../Layout/Metadata";
import { getUser, getToken, successMsg, errMsg } from "../../utils/helpers";
import ListReviews from '../Review/ListReviews';
import axios from "axios";
// import StarRating from "../Review/StarRating"; // Assuming you have a component for star rating

const ProductDetails = ({ cartItems, addItemToCart }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [user, setUser] = useState(getUser());
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorReview, setErrorReview] = useState('');
  const [success, setSuccess] = useState('');

  let { id } = useParams();

  const productDetails = async (id) => {
    try {
      let link = `${process.env.REACT_APP_API}/api/v1/singleProduct/${id}`;
      const res = await axios.get(link);
      if (!res.data) {
        setError('Product not found');
      }
      setProduct(res.data.products);
      setLoading(false);
    } catch (error) {
      setError(errMsg(error));
      setLoading(false);
    }
  };

  const increaseQty = () => {
    const count = document.querySelector('.count');
    if (count.valueAsNumber >= product.stock) return;
    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const decreaseQty = () => {
    const count = document.querySelector('.count');
    if (count.valueAsNumber <= 1) return;
    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const addToCart = async () => {
    await addItemToCart(id, quantity);
  };

  const setUserRatings = () => {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
      star.starValue = index + 1;
      ['click', 'mouseover', 'mouseout'].forEach(function (e) {
        star.addEventListener(e, showRatings);
      });
    });

    function showRatings(e) {
      stars.forEach((star, index) => {
        if (e.type === 'click') {
          if (index < this.starValue) {
            star.classList.add('orange');
            setRating(this.starValue);
          } else {
            star.classList.remove('orange');
          }
        }

        if (e.type === 'mouseover') {
          if (index < this.starValue) {
            star.classList.add('yellow');
          } else {
            star.classList.remove('yellow');
          }
        }

        if (e.type === 'mouseout') {
          star.classList.remove('yellow');
        }
      });
    }
  };

  const newReview = async (reviewData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      };

      const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/review`, reviewData, config);
      setSuccess(data.success);
    } catch (error) {
      setErrorReview(error.response.data.message);
    }
  };

  const reviewHandler = () => {
    const formData = new FormData();
    formData.set('rating', rating);
    formData.set('comment', comment);
    formData.set('productId', id);
    newReview(formData);
  };

  useEffect(() => {
    productDetails(id);

    if (errorReview) {
      errMsg(errorReview);
      setErrorReview('');
    }

    if (success) {
      successMsg('Review posted successfully');
      setSuccess(false);
    }
  }, [id, error, errorReview, success]);

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={product.name} />
          <main>
            <div className="card1">
              <div className="card__body">
                <div className="half">
                  <div className="featured_text">
                    <h1>{product.name}</h1>
                    <p className="sub">
                      <strong>Category:</strong> {product.category}
                    </p>
                    <p className="price">
                      <strong>Price: </strong>${product.price}
                    </p>
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
                    <div style={{ textDecoration: "underline", fontWeight: "700" }}>Description</div>
                    <p>{product.description}</p>
                  </div>

                  <p>Status: <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'} >{product.stock > 0 ? 'In Stock' : 'Out of Stock'}: {product.stock}</span></p>
                  <div className="reviews">
                    <div className="rating-outer">
                      <div
                        className="rating-inner"
                        style={{ width: `${(product.ratings / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span>Reviews: {product.numOfReviews}</span>
                  </div>
                  <span>
                    {product.reviews}
                  </span>
                </div>
              </div>
              <div className="card__footer">
                <div className="recommend">
                  <p>
                    <strong>Seller</strong>
                  </p>
                  <h3>{product.seller.name}</h3>
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
