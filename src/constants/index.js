import {
  ARB_NETWORK,
  BASE_NETWORK,
  BSC_NETWORK,
  ETH_NETWORK,
  POLYGON_NETWORK,
  SOLANA_NETWORK,
} from '@env';
import {
  arbitrum,
  base,
  bitcoin,
  bnb,
  eth,
  polygon,
  solana,
  tron,
} from '../assets/images';

export const ROUTES = {
  TAB: 'Tab',
  TABS: {
    MY_PROFILE: 'MyProfile',
    WALLET: 'Wallet',
    EXPLORE: 'Explore',
    SETTINGS: 'Settings',
  },
  SCREENS: {
    DASHBOARD_ANIMATION_SCREEN: 'DashboardAnimationScreen',
    DISCORD_REACTION_BUTTON_SCREEN: 'DiscordReactionButtonScreen',
    TAP_TO_POP_COUNTER_SCREEN: 'TapToPopCounterScreen',
    RIPPLE_BUTTON_SCREEN: 'RippleButtonScreen',
    ROTATING_SCALING_BOX_SCREEN: 'RotatingScalingBoxScreen',
    RANDOM_CIRCULAR_PROGRESS_BAR_SCREEN: 'RandomCircularProgressBarScreen',
    SOUND_WAVE_SCREEN: 'SoundWaveScreen',
    COLOR_CHANGING_BOX_ANIMATION_SCREEN: 'ColorChangingBoxAnimationScreen',
    LANGUAGE_SCREEN: 'Language',
    TEXT_MORPHER_SCREEN: 'TextMorpherScreen',
    BOUNCE_ANIMATION_SCREEN: 'BounceAnimationScreen',
    FLIP_ANIMATION_SCREEN: 'FlipAnimationScreen',
    BUBBLE_SORT_SCREEN: 'BubbleSortScreen',
    PASSCODE_SCREEN: 'PasscodeScreen',
  },
};

export const networks = {
  ETH: {
    key: 'ETH',
    networkName: 'Ethereum Mainnet',
    rpcUrl: ETH_NETWORK,
    chainID: 1,
    currencySymbol: 'ETH',
    blockExplorerUrl: address => {
      let url = 'https://etherscan.io';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: eth,
    accountType: 'ETH',
  },
  POLYGON: {
    key: 'POLYGON',
    networkName: 'Polygon Mainnet',
    rpcUrl: POLYGON_NETWORK,
    chainID: 137,
    currencySymbol: 'MATIC',
    blockExplorerUrl: address => {
      let url = 'https://polygonscan.com';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: polygon,
    accountType: 'ETH',
  },
  BASE: {
    key: 'BASE',
    networkName: 'Base Mainnet',
    rpcUrl: BASE_NETWORK,
    chainID: 8453,
    currencySymbol: 'ETH',
    blockExplorerUrl: address => {
      let url = 'https://basescan.org';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: base,
    accountType: 'ETH',
  },
  BNB: {
    key: 'BNB',
    networkName: 'BNB Smart Chain Mainnet',
    rpcUrl: BSC_NETWORK,
    chainID: 56,
    currencySymbol: 'BNB',
    blockExplorerUrl: address => {
      let url = 'https://bscscan.com/';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: bnb,
    accountType: 'ETH',
  },
  ARBITRUM: {
    key: 'ARBITRUM',
    networkName: 'Arbitrum One',
    rpcUrl: ARB_NETWORK,
    chainID: 42161,
    currencySymbol: 'ETH',
    blockExplorerUrl: address => {
      let url = 'https://explorer.arbitrum.io';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: arbitrum,
    accountType: 'ETH',
  },
  SOLANA: {
    key: 'SOLANA',
    networkName: 'Solana',
    rpcUrl: SOLANA_NETWORK,
    chainID: 1000,
    currencySymbol: 'SOL',
    blockExplorerUrl: address => {
      let url = 'https://solscan.io/';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: solana,
    accountType: 'SOLANA',
  },
  BITCOIN: {
    key: 'BITCOIN',
    networkName: 'Bitcoin',
    rpcUrl: '', // Bitcoin doesn't typically use RPC URLs like Ethereum,
    chainID: null, // Bitcoin doesn't have a chain ID in the same way Ethereum does
    currencySymbol: 'BTC',
    blockExplorerUrl: address => {
      let url = 'https://www.blockchain.com/explorer'; // A popular Bitcoin block explorer
      if (address) {
        return url + '/addresses/BTC/' + address;
      }
      return url;
    },
    networkImage: bitcoin,
    accountType: 'BTC',
  },
  TRON: {
    key: 'TRON',
    networkName: 'Tron',
    rpcUrl: 'https://api.trongrid.io/',
    chainID: 1000,
    currencySymbol: 'TRX',
    blockExplorerUrl: address => {
      let url = 'https://tronscan.org/#'; // A popular Bitcoin block explorer
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: tron,
    accountType: 'TRON',
  },
};

export const networkList = [
  {
    key: 'ETH',
    networkName: 'Ethereum Mainnet',
    rpcUrl: ETH_NETWORK,
    chainID: 1,
    currencySymbol: 'ETH',
    blockExplorerUrl: address => {
      let url = 'https://etherscan.io';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: eth,
    accountType: 'ETH',
  },
  {
    key: 'POLYGON',
    networkName: 'Polygon Mainnet',
    rpcUrl: POLYGON_NETWORK,
    chainID: 137,
    currencySymbol: 'MATIC',
    blockExplorerUrl: address => {
      let url = 'https://polygonscan.com';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: polygon,
    accountType: 'ETH',
  },
  {
    key: 'BASE',
    networkName: 'Base Mainnet',
    rpcUrl: BASE_NETWORK,
    chainID: 8453,
    currencySymbol: 'ETH',
    blockExplorerUrl: address => {
      let url = 'https://basescan.org';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: base,
    accountType: 'ETH',
  },
  {
    key: 'BNB',
    networkName: 'BNB Smart Chain Mainnet',
    rpcUrl: BSC_NETWORK,
    chainID: 56,
    currencySymbol: 'BNB',
    blockExplorerUrl: address => {
      let url = 'https://bscscan.com/';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: bnb,
    accountType: 'ETH',
  },
  {
    key: 'ARBITRUM',
    networkName: 'Arbitrum One',
    rpcUrl: ARB_NETWORK,
    chainID: 42161,
    currencySymbol: 'ETH',
    blockExplorerUrl: address => {
      let url = 'https://explorer.arbitrum.io';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: arbitrum,
    accountType: 'ETH',
  },
  {
    key: 'SOLANA',
    networkName: 'Solana',
    rpcUrl: SOLANA_NETWORK,
    chainID: 1000,
    currencySymbol: 'SOL',
    blockExplorerUrl: address => {
      let url = 'https://solscan.io/';
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: solana,
    accountType: 'SOLANA',
  },
  {
    key: 'BITCOIN',
    networkName: 'Bitcoin',
    rpcUrl: '', // Bitcoin doesn't typically use RPC URLs like Ethereum,
    chainID: null, // Bitcoin doesn't have a chain ID in the same way Ethereum does
    currencySymbol: 'BTC',
    blockExplorerUrl: address => {
      let url = 'https://www.blockchain.com/explorer'; // A popular Bitcoin block explorer
      if (address) {
        return url + '/addresses/BTC/' + address;
      }
      return url;
    },
    networkImage: bitcoin,
    accountType: 'BTC',
  },
  {
    key: 'TRON',
    networkName: 'Tron',
    rpcUrl: 'https://api.trongrid.io/',
    chainID: 1000,
    currencySymbol: 'TRX',
    blockExplorerUrl: address => {
      let url = 'https://tronscan.org/#'; // A popular Bitcoin block explorer
      if (address) {
        return url + '/address/' + address;
      }
      return url;
    },
    networkImage: tron,
    accountType: 'TRON',
  },
];

export const accountType = {
  ETH: 'ETH',
  SOLANA: 'SOLANA',
  BTC: 'BTC',
  TRON: 'TRON',
};
