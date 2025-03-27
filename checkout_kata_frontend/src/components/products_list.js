import "./product_list.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiShoppingCart } from "react-icons/fi";
import { BsBag, BsPlusCircle } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import OfferIcon from "../static/icons/offer.svg";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "./toasts";


const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    const GET_PRODUCTS_LIST = "http://127.0.0.1:8000/api/products/";
    const CREATE_CART = "http://127.0.0.1:8000/api/cart/";

    const navigate = useNavigate();

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(GET_PRODUCTS_LIST);
                const updatedProducts = response.data.map(product => ({
                    ...product,
                    discount: product.discount || null, // Ensure discount is null if not present
                }));
                setProducts(updatedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    // Fetch Cart Items
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(CREATE_CART);
                const total = response.data.length 
                    ? Object.values(response.data[0].items).reduce((sum, qty) => sum + qty, 0) 
                    : 0;
                setTotalItems(total);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };
        fetchCart();
    }, []);

    // Add to Cart Function
    const addToCart = async (product) => {
        try {
            const response = await axios.post(CREATE_CART, {
                product_name: product.name,
                quantity: 1,
            });

            setTotalItems(prev => prev + 1);

            showSuccessToast("Item added to cart!");

            console.log("Added to cart:", response.data);
        } catch (error) {
            showErrorToast("Failed to add item to cart!");

            console.error("Error adding to cart:", error);
        }
    };

    const handleOfferClick = (product) => {
        if (product.discount) {
            navigate(`/edit-offer/${product.discount.id}`);
        } else {
            navigate(`/add-offer/${product.id}`);
        }
    };

    return (
        <div className="container">
            {/* Header Section */}
            <div className="header">
                <h1>
                    Checkout Kata <BsBag className="shopping-bag-icon" />
                </h1>
                <button className="cart-button" onClick={() => navigate("/cart")}>
                    <FiShoppingCart size={24} />
                    {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </button>
            </div>

            {/* Product List */}
            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="offer-btn-container">
                            <p className="offer-button" onClick={() => handleOfferClick(product)}>
                                {product.discount ? (
                                    <>
                                        <MdModeEdit size={14} /> Edit Offer
                                    </>
                                ) : (
                                    <>
                                        <BsPlusCircle size={14} /> Add Offer
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Product Image (if available) */}
                        {product.image && (
                            <img src={product.image} alt={product.name} className="product-image" />
                        )}

                        <h2 className="product-name">{product.name}</h2>
                        <p className="product-price">Price: Rs {product.price}</p>

                        {product.discount ? (
                            <div className="discounts">
                                <p>
                                    <img src={OfferIcon} width="18px" height="18px" alt="Discount" className="trash-icon" />
                                    Buy {product.discount.quantity} for Rs {product.discount.discount_price}
                                </p>
                            </div>
                        ) : (
                            <div className="no-offers-container">
                                <p className="no-offers">No offers available</p>
                            </div>
                        )}

                        <button className="add-to-cart" onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsList;
