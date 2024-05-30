"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHITELISTED_USERS = exports.NEXT_PUBLIC_URL = exports.useGlobalState = void 0;
var react_hooks_global_state_1 = require("react-hooks-global-state");
var initialState = {
    walletAddress: "",
    signerUuid: "",
    fid: "",
    ethAddress: "",
    username: "",
    selectedProjectName: "",
    selectedProject: null,
};
var useGlobalState = (0, react_hooks_global_state_1.createGlobalState)(initialState).useGlobalState;
exports.useGlobalState = useGlobalState;
exports.NEXT_PUBLIC_URL = "https://www.metricsgarden.xyz/";
//export const NEXT_PUBLIC_URL = "http://localhost:3001";
exports.WHITELISTED_USERS = [
    "453987",
    "11596",
    "429828",
    "18391",
    "10610",
];
