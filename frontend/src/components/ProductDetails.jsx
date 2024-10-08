import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  fetchSingleProduct,
  similarProduct,
} from "../app/features/product/productSlice";
import ReviewInput from "./ReviewInput";
import ReviewCard from "./ReviewCard";
import "../rating.css";
import { setMessage } from "../app/features/message/messageSlice";
import SimilarProduct from "./SimilarProduct";
import { setCheckOutProducts } from "../app/features/order/CheckOutSlice";
export default function ProductDetails() {
  const { id } = useParams();
  const user = useSelector((state) => state.User.User);
  const isAdmin = useSelector((state) => state?.User?.User?.user);
  const [cartItemNum, setcartitemNum] = useState(1);
  const [showReview, setshowReview] = useState(false);
  const [initialReviewCount, setInitialReviewCount] = useState(6);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Product = useSelector((state) => state.Product.Product);
  const showReviewData = showReview
    ? Product?.reviews
    : Product?.reviews.slice(0, initialReviewCount);
  const [currimg, setcurrimg] = useState(0);

  const addCartItem = async () => {
    try {
      await dispatch(addToCart({ id, quantity: cartItemNum })).unwrap();
      dispatch(
        setMessage({ message: "product added to the cart", success: true })
      );
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };

  const getData = async () => {
    await dispatch(fetchSingleProduct(id));
  };
  const getSimilarProducts = async () => {
    if (Product?.category) {
      await dispatch(
        similarProduct({ id: Product._id, category: Product?.category })
      );
    }
  };
  const handleChekout = () => {
    console.log(Product);
    dispatch(setCheckOutProducts([{ product: Product, quantity: 1 }]));
    navigate("/checkout");
  };
  const handleEdit = () => {
    navigate(`/products/edit/${Product._id}`);
  };

  useEffect(() => {
    getData();
  }, [id, dispatch]);
  useEffect(() => {
    getSimilarProducts();
  }, [Product?._id, Product?.category, dispatch]);

  return (
    <>
      {Product && (
        <div className={`w-[90%] mx-auto `}>
          <div className="w-full   py-4 lg:flex ">
            <div className="flex flex-col-reverse w-full  sm:flex-row  lg:w-1/2 sm:h-[60vh] ">
              <div className="gap-4 flex sm:flex-col imgs w-full h-full sm:w-28 sm:h-full  overflow-x-auto sm:overflow-y-auto  ">
                {Product.image.map((img, idx) => (
                  <img
                    src={img.url}
                    key={idx}
                    className={`w-20 h-20 sm:w-full sm:h-24 object-cover mt-2 rounded-lg  ${
                      currimg === idx && "border-2 border-zinc-800 "
                    }`}
                    onMouseOver={() => setcurrimg(idx)}
                  />
                ))}
              </div>
              <div className="w-full h-80  sm:w-[90%] sm:h-96 flex justify-center">
                <img
                  src={Product?.image[currimg]?.url}
                  alt=""
                  className="w-full h-full object-contain object-center "
                />
              </div>
            </div>

            <div className="details lg:w-1/2  sm::h-full p-4 lg:p-8 flex flex-col ">
              <div className=" flex-grow">
                <h2 className="text-4xl font-semibold">{Product.name}</h2>
                <p className="text-xl py-2">{Product.description}</p>
                <div className="flex gap-4">
                  <p className="font-medium text-lg">
                    {" "}
                    &#8377;{Product.sellingPrice}
                  </p>{" "}
                  <p className="line-through text-zinc-600">
                    &#8377;{Product.price}
                  </p>
                </div>
              </div>
              <div className="btn  flex flex-col  gap-4 ">
                {user && isAdmin?.isAdmin && (
                  <div>
                    <button
                      onClick={handleEdit}
                      className="bg-red-500 px-6 rounded-lg py-2 text-white"
                    >
                      Edit
                    </button>
                  </div>
                )}
                <div className="flex gap-8">
                  <div>
                    <button
                      onClick={handleChekout}
                      className="bg-orange-400 text-white font-semibold h-full sm:w-44 rounded-full p-2 px-8 hover:bg-amber-500 hover:font-bold"
                    >
                      Buy Now{" "}
                    </button>{" "}
                  </div>
                  <div>
                    <p
                      onClick={addCartItem}
                      className="bg-[#332E3C] hover:bg-zinc-100 hover:border hover:border-zinc-400 hover:text-black text-white py-2 sm:w-48 text-center rounded-full group px-4"
                    >
                      {" "}
                      <i className="ri-shopping-cart-line text-xl text-white px-2 group-hover:text-black "></i>
                      <span className=" font-semibold"> Add to Cart </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <SimilarProduct />
          </div>
          {user && (
            <div className="py-4">
              <ReviewInput />
            </div>
          )}

          <div className="flex flex-wrap  gap-4 mb-4 lg:mx-12 ">
            <h2 className="w-full text-2xl">
              {Product.reviews.length > 0 && "All Review"}
            </h2>
            {showReviewData &&
              showReviewData.map((rew, idx) => (
                <ReviewCard rew={rew} key={rew._id} />
              ))}
          </div>
          {Product.reviews.length > 6 && (
            <div
              className="lg:mx-12"
              onClick={() => setshowReview(!showReview)}
            >
              <div className="flex w-fit">
                <p className="font-normal text-[#007185]">
                  {" "}
                  {showReview ? "Show Less" : "See More Reviews"}{" "}
                </p>
                <i className="ri-arrow-drop-right-line text-lg text-[#007185]"></i>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
