import { createGlobalState } from "react-hooks-global-state";
import { Project } from "../../src/types";

const initialState = {
  walletAddress: "",
  signerUuid: "",
  fid: "",
  ethAddress: "",
  username: "",
  selectedProjectName: "",
  selectedProject: null as Project | null,
  isAuthenticated: false,
};

const { useGlobalState } = createGlobalState(initialState);

export { useGlobalState };

// Determine environment and set the correct URL
const isProduction = process.env.NODE_ENV === "production";
export const NEXT_PUBLIC_URL = isProduction
  ? "https://www.metricsgarden.xyz/" // Production URL
  : "http://localhost:3000"; // Local development URL

export const WHITELISTED_USERS = [
  "453987",
  "11596",
  "429828",
  "18391",
  "10610",
];
