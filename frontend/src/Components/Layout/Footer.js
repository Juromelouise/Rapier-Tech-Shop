import React, { Fragment } from 'react';
import "../../App.css";

const Footer = () => {
    return (
        <footer className="py-1">
            <div className="footer-content">
                <h3>RAPIER TECH SHOP</h3>
                <p>"Welcome to Rapier Tech Shop, where innovation meets excellence! As pioneers in cutting-edge technology, we specialize in providing top-tier solutions and state-of-the-art gadgets that redefine modern living. At Rapier Tech Shop, we believe in merging convenience with sophistication, offering a diverse range of products that cater to every tech enthusiast's needs. From the latest smartphones to futuristic smart home devices and beyond, our commitment is to bring you the finest quality tech innovations. Join us on this journey of exploration and discovery as we bring tomorrow's technology to your fingertips today at Rapier Tech Shop."</p>
                <ul className="socials">
  <li><a href="#"><img src="../images/facebook.PNG" alt="Facebook" /></a></li>
  <li><a href="#"><img src="../images/twitter.PNG" alt="Twitter" /></a></li>
  <li><a href="#"><img src="../images/google.PNG" alt="Google" /></a></li>
  <li><a href="#"><img src="../images/youtube.PNG" alt="YouTube" /></a></li>
  <li><a href="#"><img src="../images/instagram.PNG" alt="Instagram" /></a></li>
</ul>
            </div>
            <div className="footer-bottom">
                <p>Rapier Tech Shop - 2022-2023, All Rights Reserved</p>
                <div className="footer-menu">
                    <ul className="f-menu">
                        <li><a href="">Home</a></li>
                        <li><a href="">About</a></li>
                        <li><a href="">Contact</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
} 

export default Footer;
