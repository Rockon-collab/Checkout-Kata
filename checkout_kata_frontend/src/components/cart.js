import "./cart.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrashIcon from "../static/icons/bin.svg";

import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "./toasts";



const CartPage = () => {
    const [cart, setCart] = useState({ items: {}, total_price: 0 });

    const CART_API = "http://127.0.0.1:8000/api/cart/";

    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const response = await axios.get(CART_API);

            if (Array.isArray(response.data) && response.data.length > 0) {
                setCart(response.data[0]);
            } else {
                setCart({ items: {}, total_price: 0 });
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart({ items: {}, total_price: 0 });
        }
    };


    useEffect(() => {
        fetchCart();
    }, []);

    const updateCartItem = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeCartItem(productId);
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/api/cart/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_name: productId, quantity: newQuantity }),
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                showSuccessToast(`Item ${productId} updated successfully`)
            } else {
                showErrorToast("Failed to update cart");
            }
        } catch (error) {
            showErrorToast("Error updating cart");
        }
    };

    const removeCartItem = async (productId) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/cart/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_name: productId }),
            });

            if (response.ok) {
                setCart((prevCart) => {
                    const updatedItems = { ...prevCart.items };
                    delete updatedItems[productId];
                    return { ...prevCart, items: updatedItems };
                });
                showSuccessToast(`Item ${productId} removed successfully`);
            } else {
                showErrorToast("Failed to remove item");
            }
        } catch (error) {
            showErrorToast("Error removing cart item");
        }
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            <button className="back-button" onClick={() => navigate("/")}>Go back Back to Shop</button>

            {Object.keys(cart?.items || {}).length > 0 ? (
                <div>
                    <div className="cart-items">
                        {Object.entries(cart.items || {}).map(([product, quantity]) => (
                            <div key={product} className="cart-item">
                                <h3 className="cart-item-name">{product}</h3>
                                <p className="cart-item-quantity">Quantity: {quantity}</p>

                                <div className="cart-item-controls">
                                    <button className="cart-btn" onClick={() => updateCartItem(product, quantity + 1)}>+</button>
                                    <button
                                        className="cart-btn"
                                        onClick={() => updateCartItem(product, quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <button className="remove-btn" onClick={() => removeCartItem(product)}>
                                        <img src={TrashIcon} width="18px" height="18px" alt="Remove" className="trash-icon" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p><strong>Total MRP:</strong> ${cart ? (cart.total_mrp / 100).toFixed(2) : "0.00"}</p>
                        <p><strong>Total Discount:</strong> ${cart ? ((cart.total_mrp - cart.total_price) / 100).toFixed(2) : "0.00"}</p>
                    </div>

                    <div className="cart-item cart-total">
                        <span className="cart-label">Total Price: </span>
                        <span className="cart-price">${cart ? (cart.total_price / 100).toFixed(2) : "0.00"}</span>
                    </div>

                </div>


            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default CartPage;
