import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  walletAddress: "",
};

const { useGlobalState } = createGlobalState(initialState);

export { useGlobalState };
