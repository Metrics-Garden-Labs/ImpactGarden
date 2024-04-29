import { createGlobalState } from "react-hooks-global-state";
import { Project } from "@/src/types";

const initialState = {
  walletAddress: "",
  signerUuid: "",
  fid: "",
  ethAddress: "",
  selectedProjectName: "",
  selectedProject: null as Project | null,
};

const { useGlobalState } = createGlobalState(initialState);

export { useGlobalState };
