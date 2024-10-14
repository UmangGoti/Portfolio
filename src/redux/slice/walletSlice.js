import {createSlice} from '@reduxjs/toolkit';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    ethAccounts: [],
    solAccounts: [],
    btcAccounts: [],
    tronAccounts: [],
    wallets: {},
    selectedWallet: {},
  },
  reducers: {
    createWallet: (state, action) => {
      const {ethAccount, solAccount, btcAccount, tronAccount} = action.payload;
      state.selectedWallet = ethAccount;
      if (ethAccount) state.ethAccounts = [...state.ethAccounts, ethAccount];
      if (solAccount) state.solAccounts = [...state.solAccounts, solAccount];
      if (btcAccount) state.btcAccounts = [...state.btcAccounts, btcAccount];
      if (tronAccount)
        state.tronAccounts = [...state.tronAccounts, tronAccount];

      state.wallets = {
        ...state.wallets,
        ethAccounts: state.ethAccounts,
        solAccounts: state.solAccounts,
        btcAccounts: state.btcAccounts,
        tronAccounts: state.tronAccounts,
      };
    },
  },
});

export const {createWallet} = walletSlice.actions;
export default walletSlice.reducer;
