import React from "react";
import "./Home.css";
import Header from "../../Components/Header/Header";
import freshFruits from "../../Assets/Images/freshFruits.png";
import featureImg1 from "../../Assets/Images/feature-img-1.png";
import featureImg2 from "../../Assets/Images/feature-img-2.png";
import featureImg3 from "../../Assets/Images/feature-img-3.png";
import { FaStar } from "react-icons/fa";
import "../../Assets/js/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import { useEffect } from "react";
import { getAllCategoryAction } from "../../Redux/Actions/categoryAction";
import { getAllReviewsAction } from "../../Redux/Actions/reviewsAction";
import axios from "axios";
import { useState } from "react";

const Home = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  //getting user from user
  const { loading: userLoading, user } = useSelector((state) => state.user);

  //getting category from state
  const { loading: categoryLoading, Categories } = useSelector(
    (state) => state.getAllCategory
  );

  //getting all Reviews from state
  const {
    reviews,
    loading: reviewsLoading,
    error,
  } = useSelector((state) => state.getAllReviews);

  //Get Recent Products
  const [recentProductLoading, setRecentLoading] = useState(false);
  const [recentProductsError, setRecentProductsError] = useState(false);
  const [recentProductsSuccess, setRecentProductsSuccess] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);

  const getRecentProducts = async () => {
    try {
      setRecentLoading(true);
      const { data } = await axios.get("/api/product/recent/products");
      setRecentProducts(data.products);
      setRecentLoading(false);
      setRecentProductsSuccess(true);
      setRecentLoading(false);
    } catch (error) {
      setRecentLoading(false);
      setRecentProductsError(true);
      // console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Home";
    dispatch(getAllCategoryAction());
    dispatch(getAllReviewsAction());
    getRecentProducts();
  }, [dispatch]);

  const options = {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    autoplay: {
      delay: 5000,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
    // navigation: true,
    modules: [Autoplay, Navigation],
    className: "mySwiper",
  };

  return (
    <>
      <Header />

      {userLoading ||
      categoryLoading ||
      reviewsLoading ||
      recentProductLoading ? (
        <Loader LoadingName={"Loading Home"} />
      ) : (
        <>
          <div className="main-home">
            <section className="home">
              <div className="content">
                <h3>
                  Fresh And <span>Organic</span> Groceries for India
                </h3>
                <p>
                  We are India's fastest growing online grocery store. <br /> We ensure high quality
                  groceries are sold at low costs and with lighting speed !
                </p>
                <Link to="/products">
                  {" "}
                  <button className="shopNowBtn">Shop Now</button>{" "}
                </Link>
              </div>
            </section>
          </div>

          {/* Our Features */}

          <section className="features" id="features">
            <h1 className="Heading">
              Our <span>Features</span>
            </h1>
            <div className="box-container">
              <div className="box">
                <img src={featureImg1} alt="" />
                <h3>Fresh And Organic</h3>
                <p>
                We take pride in offering only the freshest and highest-quality organic products. Sourced from trusted local farms, our fruits, vegetables, and other organic items are free from harmful pesticides and chemicals.
                </p>
              </div>

              <div className="box">
                <img src={featureImg2} alt="" />
                <h3>Free Delivery</h3>
                <p>
                  {" "}
                  Enjoy the convenience of free delivery on all your orders! We make shopping easier by bringing your groceries straight to your doorstep, with no hidden fees or extra charges.
                </p>
              </div>

              <div className="box">
                <img src={featureImg3} alt="" />
                <h3>Cash On Delivery</h3>
                <p>
                Shop with confidence and convenience using our Cash on Delivery (COD) option. No need for online payments—simply place your order, and pay in cash when your groceries arrive at your doorstep.
                </p>
              </div>
            </div>
          </section>

          {/* Our Products */}
          <section className="top-products">
            <h1 className="Heading">
              New<span>Products</span>
            </h1>
            <div className="product-slider">
              <Swiper {...options}>
                <div className="wrapper">
                  {recentProducts.length !== 0 &&
                  recentProductsSuccess == true ? (
                    <>
                      {recentProducts.map((item) => {
                        return (
                          <SwiperSlide key={item._id}>
                            <div className="box">
                              <img src={item.url} alt="" />
                              <h1>{item.name}</h1>
                              <div className="price"> Rate : ₹ {item.rate}</div>
                              <button
                                className="shopNowBtn"
                                onClick={() => {
                                  Navigate(`/products/${item.name}`);
                                }}
                              >
                               View Product
                              </button>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </Swiper>
            </div>
          </section>

          <section className="categories" id="categories">
            <h1 className="Heading">
              Product<span>Categories</span>
            </h1>
            <div className="category-box-container">
              {Categories &&
                Categories.map((category) => {
                  return (
                    <div className="box" key={category._id}>
                      <img src={category.categoryImage} alt="" />
                      <h1>Fresh {category.categoryName}</h1>
                      <br />
                      <Link
                        to={`/products?categoryId=${category._id}&categoryName=${category.categoryName}`}
                        className="shopNowBtn"
                      >
                        Shop Now
                      </Link>
                    </div>
                  );
                })}
            </div>
          </section>

          <section className="top-products" id="reviews">
            <h1 className="Heading">
              Customer <span>Reviews</span>
            </h1>
            <div className="product-slider">
              <Swiper {...options}>
                <div className="wrapper">
                  {reviews &&
                    reviews.map((review) => {
                      return (
                        <SwiperSlide key={review._id}>
                          <div className="box reviews-box">
                            {/* <img src={pic1} alt="" /> */}
                            <h1>
                              {" "}
                              {review.user.firstName +
                                " " +
                                review.user.lastName}
                            </h1>
                            <div className="price">{review.comment}</div>
                            <div className="stars">
                              <i>{<FaStar />}</i>
                              <i>{<FaStar />}</i>
                              <i>{<FaStar />}</i>
                              <i>{<FaStar />}</i>
                              <i>{<FaStar />}</i>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                </div>
              </Swiper>
            </div>
          </section>
          <br />
          <br />
          <br />
        </>
      )}

      <Footer />
    </>
  );
};

export default Home;
