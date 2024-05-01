import { createGlobalState } from "react-hooks-global-state";
import { Project } from "@/src/types";

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

export const NEXT_PUBLIC_URL = "https://module3-nu.vercel.app";
//export const NEXT_PUBLIC_URL = "http://localhost:3001";
