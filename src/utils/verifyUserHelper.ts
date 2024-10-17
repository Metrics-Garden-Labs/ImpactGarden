import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

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
    const response = await axios.post<VerifyUserResponse>("/api/verify-user", {
      signerUuid,
      fid,
    });

    isVerifiedUser = response.data.isVerifiedUser;
  } catch (err) {
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
