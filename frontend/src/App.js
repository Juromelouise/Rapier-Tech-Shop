import logo from "./logo.svg";
import "./App.css";
import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import Home from "./Components/Home";

function App() {
  return (
    <div className="App">
      <Header/>
      <Home/>
      <Footer/>
    </div>
  );
}

export default App;
