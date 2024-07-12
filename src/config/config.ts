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
};

const { useGlobalState } = createGlobalState(initialState);

export { useGlobalState };

// export const NEXT_PUBLIC_URL =
// "https://module3-git-newschema-metrics-garden-labs.vercel.app";
export const NEXT_PUBLIC_URL = "http://localhost:3000";
// export const NEXT_PUBLIC_URL = "https://www.metricsgarden.xyz/";

export const WHITELISTED_USERS = [
  "453987",
  "11596",
  "429828",
  "18391",
  "10610",
];
