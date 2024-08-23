import axios, { AxiosError } from "axios";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

interface VerifyUserResponse {
  isVerifiedUser: boolean;
}

interface ErrorRes {
  message: string;
}

export const verifyUser = async (
  signerUuid: string,
  fid: string
): Promise<boolean> => {
  let isVerifiedUser = false;

  try {
    // Make a POST request to your verify-user API route
    const response = await axios.post<VerifyUserResponse>("/api/verify-user", {
      signerUuid,
      fid,
    });

    // Extract the isVerifiedUser flag from the response
    isVerifiedUser = response.data.isVerifiedUser;
  } catch (err) {
    // Handle errors, with proper type checks
    if (err instanceof AxiosError) {
      const errorData = err.response?.data as ErrorRes;
      const errorMessage = errorData?.message || "An unexpected error occurred";
      toast(errorMessage, {
        type: "error",
        theme: "dark",
        autoClose: 3000,
        position: "bottom-right",
        pauseOnHover: true,
      });
    } else {
      toast("An unexpected error occurred", {
        type: "error",
        theme: "dark",
        autoClose: 3000,
        position: "bottom-right",
        pauseOnHover: true,
      });
    }
  }

  return isVerifiedUser;
};

export const removeSearchParams = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};
