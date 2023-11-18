import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import Header from "./Components/Layout/Header";
import Footer from "./Components/Layout/Footer";
import Home from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/User/Register";
import Login from "./Components/User/Login";
import ProductDetails from "./Components/Product/ProductDetails";
import Cart from "./Components/Cart/Cart";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function App() {
  const [state, setState] = useState({
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  });
  const addItemToCart = async (id, quantity) => {
    console.log(id, quantity);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/singleProduct/${id}`
      );
      const item = {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity: quantity,
      };

      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );
      console.log(isItemExist, state);
      // setState({
      //   ...state,
      //   cartItems: [...state.cartItems, item],
      // });
      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.product === isItemExist.product ? item : i
          ),
        });
      } else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item],
        });
      }

      toast.success("Item Added to Cart", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT,
      });
      // navigate('/')
    }
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  };

  const removeItemFromCart = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter((i) => i.product !== id),
    });
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  };

  const saveShippingInfo = async (data) => {
    setState({
      ...state,
      shippingInfo: data,
    });
    localStorage.setItem("shippingInfo", JSON.stringify(data));
  };

  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} caseSensitive={true} />
          <Route path="/register" element={<Register />} caseSensitive={true} />
          <Route path="/login" element={<Login />} caseSensitive={true} />
          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/" element={<Home />} caseSensitive={true} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={state.cartItems}
                addItemToCart={addItemToCart}
                removeItemFromCart={removeItemFromCart}
              />
            }
            exact="true"
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                cartItems={state.cartItems}
                addItemToCart={addItemToCart}
              />
            }
            exact="true"
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
