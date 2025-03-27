import { toast } from "react-toastify";

// Common Toast Configuration
const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
};

// Reusable Toast Functions
export const showSuccessToast = (message) => {
    toast.success(message, toastOptions);
};

export const showErrorToast = (message) => {
    toast.error(message, toastOptions);
};

export const showInfoToast = (message) => {
    toast.info(message, toastOptions);
};

export const showWarningToast = (message) => {
    toast.warning(message, toastOptions);
};
