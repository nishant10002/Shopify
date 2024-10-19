import React from "react";
import "./Footer.css";
import { RiShoppingBasketFill, RiMapPin2Line } from "react-icons/ri";
import { SlSocialInstagram } from "react-icons/sl";
import { TiSocialTwitter, TiSocialLinkedin } from "react-icons/ti";
import { IoLogoWhatsapp } from "react-icons/io";
import { MdPhoneForwarded, MdOutlineMarkEmailRead } from "react-icons/md";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import CreditCard from "../../../src/Assets/Images/payment.png";
import { useState } from "react";

const Footer = () => {
  const [message, setMessage] = useState();
  const sendMessage = () => {
    window.location = `https://wa.me/7350403908?text=${message}`;
  };
  return (
    <>
      <footer>
        <section className="footer">
          <div className="box-container">
            <div className="box">
              <h3>
                Shopify <i>{<RiShoppingBasketFill />}</i>
              </h3>
              <p>
                Get Fresh And Organic Groceries Delivered Right To Your Footstep !
              </p>
              <div className="share">
                <Link>
                  <i
                    onClick={() => {
                      window.location = `https://wa.me/7350403908?text=Say Hello..!!`;
                    }}
                  >
                    {<IoLogoWhatsapp />}
                  </i>
                </Link>
                <a href="https://instagram.com/nishant10002">
                  <i>{<SlSocialInstagram />}</i>
                </a>
                <Link to="#">
                  <i>{<TiSocialTwitter />}</i>
                </Link>
                <Link>
                  <i>{<TiSocialLinkedin />}</i>
                </Link>
              </div>
            </div>

            {/* Contact Section */}

            <div className="box">
              <h3>Contact Us </h3>
              <Link className="links">
                <i>
                  <MdPhoneForwarded />
                </i>
                +91 8383014010
              </Link>

              <a href="mailto:nishant22328@iiitd.ac.in" className="links">
                <i>
                  <MdOutlineMarkEmailRead />
                </i>
                nishant22328@iiitd.ac.in
              </a>

              <Link className="links">
                <i>
                  <RiMapPin2Line />
                </i>
                New Delhi, India
              </Link>
            </div>

            {/* Quick Link */}

            <div className="box">
              <h3>Quick Link </h3>
              <Link to="/" className="links">
                <i>
                  <AiOutlineArrowRight />
                </i>
                Home
              </Link>

              <Link to={"/"} className="links">
                <i>
                  <AiOutlineArrowRight />
                </i>
                Features
              </Link>

              <Link to="/products" className="links">
                <i>
                  <AiOutlineArrowRight />
                </i>
                Products
              </Link>

              <Link to="/reviews/all" className="links">
                <i>
                  <AiOutlineArrowRight />
                </i>
                Reviews
              </Link>
            </div>
            {/* Quick Chat */}
            <div className="box">
              <h3>Let's Chats </h3>
              <p>Type Message..</p>
              <input
                type="text"
                className="whats-message"
                placeholder="Enter Your Message.."
                onChange={(e) => setMessage(e.target.value)}
              />

              <button className="sendMsgBtn" onClick={sendMessage}>
                Send
              </button>
              <img src={CreditCard} alt="Payment Img" className="payment-img" />
            </div>
          </div>
          <div className="credit">
            Created By <span>Nishant Singh </span> | Shopify@2024
          </div>
        </section>
      </footer>
    </>
  );
};

export default Footer;
