import {createSlice} from '@reduxjs/toolkit';
import {accountType, networks} from '../../constants';

const accountTypeMapping = {
  [accountType.ETH]: 'ethAccounts',
  [accountType.SOLANA]: 'solAccounts',
  [accountType.BTC]: 'btcAccounts',
  [accountType.TRON]: 'tronAccounts',
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    ethAccounts: [],
    solAccounts: [],
    btcAccounts: [],
    tronAccounts: [],
    currentAccount: {}, // current selected wallet
    wallets: [], // current wallet list
    currentNetwork: {}, // current selected network.
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
    setWallets: (state, action) => {
      const selectedAccountType = action.payload;
      const accountListKey = accountTypeMapping[selectedAccountType];
      if (accountListKey) {
        state.wallets = state[accountListKey];
        state.currentAccount = state[accountListKey][0];
      }
    },
    addNewAccount: (state, action) => {
      const account = action.payload;
      const accountListKey = accountTypeMapping[account?.accountType];
      if (accountListKey) {
        state[accountListKey] = [...state[accountListKey], {...account}];
        state.wallets = [...state[accountListKey]]; // To update current wallet list too.
      }
    },
  },
});

export const {
  createWallet,
  setCurrentAccount,
  setCurrentNetwork,
  setWallets,
  addNewAccount,
} = walletSlice.actions;
export default walletSlice.reducer;
