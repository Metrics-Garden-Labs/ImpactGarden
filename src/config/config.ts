import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  walletAddress: "",
  signerUuid: "",
  fid: "",
  ethAddress: "",
};

const { useGlobalState } = createGlobalState(initialState);

export { useGlobalState };
