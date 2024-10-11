import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    ethAccounts: [],
    solAccounts: [],
    btcAccounts: [],
    tronAccounts: [],
  },
  reducers: {
    createWallet: (state, action) => {
      const { ethAccount, solAccount, btcAccount, tronAccount } =
        action.payload;
      console.log("====================================");
      console.log(action.payload);
      console.log("====================================");
      if (ethAccount) state.ethAccounts = [...state.ethAccounts, ethAccount];
      if (solAccount) state.solAccounts = [...state.solAccounts, solAccount];
      if (btcAccount) state.btcAccounts = [...state.btcAccounts, btcAccount];
      if (tronAccount)
        state.tronAccounts = [...state.tronAccounts, tronAccount];
    },
  },
});

export const { createWallet } = walletSlice.actions;
export default walletSlice.reducer;
