import logo from "./logo.svg";
import "./App.css";
import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import Home from "./Components/Home";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from "./Components/User/Register";
import Login from "./Components/User/Login";
import ProductDetails from "./Components/Product/ProductDetails";


function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} caseSensitive={true} />
          <Route path='/register' element={<Register />} caseSensitive={true} />
          <Route path='/login' element={<Login />} caseSensitive={true} />
          <Route path="/product/:id" element={<ProductDetails />} exact="true" />
          {/* <Route path="/product/:id" element={<ProductDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact="true" /> */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
