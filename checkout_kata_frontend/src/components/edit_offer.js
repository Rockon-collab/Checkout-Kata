import "./edit_offer.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { showErrorToast, showSuccessToast } from "./toasts";

const GET_OFFER_DETAILS = "http://127.0.0.1:8000/api/api/discounts/";
const UPDATE_OFFER = "http://127.0.0.1:8000/api/discounts/update/";
const DELETE_OFFER = "http://127.0.0.1:8000/api/discounts/delete/";


const EditOffer = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [offer, setOffer] = useState({ product: "", quantity: "", discount_price: "" });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!productId) return;

        axios.get(`${GET_OFFER_DETAILS}${productId}/`)
            .then(response => {
                setOffer({
                    product: response.data.product,
                    quantity: response.data.quantity,
                    discount_price: response.data.discount_price
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching offer:", error);
                setLoading(false);
            });
    }, [productId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${UPDATE_OFFER}${productId}/`, {
                quantity: parseInt(offer.quantity),
                discount_price: parseFloat(offer.discount_price)
            });

            showSuccessToast("Offer updated successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error updating offer:", error);
            showErrorToast("Failed to update offer. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${DELETE_OFFER}${productId}/`);
            showSuccessToast("Offer deleted successfully!")

            navigate("/");
        } catch (error) {
            console.error("Error deleting offer:", error);
            showErrorToast("Failed to delete the offer.");
        }
    };

    return (
        <div className="edit-offer-container">
            <h2>Edit Offer</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <form onSubmit={handleUpdate}>
                    <label>Product ID:</label>
                    <input type="text" value={offer.product || ""} readOnly />

                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={offer.quantity || ""}
                        onChange={(e) => setOffer({ ...offer, quantity: e.target.value })}
                        required
                    />

                    <label>Discount Price:</label>
                    <input
                        type="number"
                        value={offer.discount_price || ""}
                        onChange={(e) => setOffer({ ...offer, discount_price: e.target.value })}
                        required
                    />

                    {/* Button Container for Alignment */}
                    <div className="button-container">
                        <button type="submit" className="update-button">Update Offer</button>
                        <button type="button" className="delete-button" onClick={handleDelete}>Delete Offer</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EditOffer;
