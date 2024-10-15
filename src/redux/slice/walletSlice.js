import {createSlice} from '@reduxjs/toolkit';
import {networkList, networks} from '../../constants';

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    ethAccounts: [],
    solAccounts: [],
    btcAccounts: [],
    tronAccounts: [],
    currentAccount: {}, // current selected wallet
    wallets: [], // current wallet list
    currentNetwork: {},
  },
  reducers: {
    createWallet: (state, action) => {
      const {ethAccount, solAccount, btcAccount, tronAccount} = action.payload;
      state.currentAccount = ethAccount;
      state.currentNetwork = networks.ETH;
      if (ethAccount) state.ethAccounts = [...state.ethAccounts, ethAccount];
      if (solAccount) state.solAccounts = [...state.solAccounts, solAccount];
      if (btcAccount) state.btcAccounts = [...state.btcAccounts, btcAccount];
      if (tronAccount)
        state.tronAccounts = [...state.tronAccounts, tronAccount];
      state.wallets = state.ethAccounts;
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setCurrentNetwork: (state, action) => {
      state.currentNetwork = action.payload;
    },
  },
});

export const {createWallet, setCurrentAccount, setCurrentNetwork} =
  walletSlice.actions;
export default walletSlice.reducer;
