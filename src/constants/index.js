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
import {
  ETH_NETWORK,
  POLYGON_NETWORK,
  BASE_NETWORK,
  BSC_NETWORK,
  ARB_NETWORK,
  SOLANA_NETWORK,
} from '@env';

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
    networkName: 'Ethereum Mainnet',
    rpcUrl: ETH_NETWORK,
    chainID: 1,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io',
    networkImage: eth,
  },
  POLYGON: {
    networkName: 'Polygon Mainnet',
    rpcUrl: POLYGON_NETWORK,
    chainID: 137,
    currencySymbol: 'MATIC',
    blockExplorerUrl: 'https://polygonscan.com/',
    networkImage: polygon,
  },
  BASE: {
    networkName: 'Base Mainnet',
    rpcUrl: BASE_NETWORK,
    chainID: 8453,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://basescan.org',
    networkImage: base,
  },
  BNB: {
    networkName: 'BNB Smart Chain Mainnet',
    rpcUrl: BSC_NETWORK,
    chainID: 56,
    currencySymbol: 'BNB',
    blockExplorerUrl: 'https://bscscan.com/',
    networkImage: bnb,
  },
  ARBITRUM: {
    networkName: 'Arbitrum One',
    rpcUrl: ARB_NETWORK,
    chainID: 42161,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://explorer.arbitrum.io',
    networkImage: arbitrum,
  },
  SOLANA: {
    networkName: 'Solana',
    rpcUrl: SOLANA_NETWORK,
    chainID: 1000,
    currencySymbol: 'SOL',
    blockExplorerUrl: 'https://solscan.io/',
    networkImage: solana,
  },
  BITCOIN: {
    networkName: 'Bitcoin',
    rpcUrl: '', // Bitcoin doesn't typically use RPC URLs like Ethereum,
    chainID: null, // Bitcoin doesn't have a chain ID in the same way Ethereum does
    currencySymbol: 'BTC',
    blockExplorerUrl: 'https://www.blockchain.com/explorer', // A popular Bitcoin block explorer
    networkImage: bitcoin,
  },
  TRON: {
    networkName: 'Tron',
    rpcUrl: 'https://api.trongrid.io/',
    chainID: 1000,
    currencySymbol: 'TRX',
    blockExplorerUrl: 'https://tronscan.org/#',
    networkImage: tron,
  },
};

export const networkList = [
  {
    networkName: 'Ethereum Mainnet',
    rpcUrl: ETH_NETWORK,
    chainID: 1,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io',
    networkImage: eth,
    accountType: 'ETH',
  },
  {
    networkName: 'Polygon Mainnet',
    rpcUrl: POLYGON_NETWORK,
    chainID: 137,
    currencySymbol: 'MATIC',
    blockExplorerUrl: 'https://polygonscan.com/',
    networkImage: polygon,
    accountType: 'ETH',
  },
  {
    networkName: 'Base Mainnet',
    rpcUrl: BASE_NETWORK,
    chainID: 8453,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://basescan.org',
    networkImage: base,
    accountType: 'ETH',
  },
  {
    networkName: 'BNB Smart Chain Mainnet',
    rpcUrl: BSC_NETWORK,
    chainID: 56,
    currencySymbol: 'BNB',
    blockExplorerUrl: 'https://bscscan.com/',
    networkImage: bnb,
    accountType: 'ETH',
  },
  {
    networkName: 'Arbitrum One',
    rpcUrl: ARB_NETWORK,
    chainID: 42161,
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://explorer.arbitrum.io',
    networkImage: arbitrum,
    accountType: 'ETH',
  },
  {
    networkName: 'Solana',
    rpcUrl: SOLANA_NETWORK,
    chainID: 1000,
    currencySymbol: 'SOL',
    blockExplorerUrl: 'https://solscan.io/',
    networkImage: solana,
    accountType: 'SOLANA',
  },
  {
    networkName: 'Bitcoin',
    rpcUrl: '', // Bitcoin doesn't typically use RPC URLs like Ethereum,
    chainID: null, // Bitcoin doesn't have a chain ID in the same way Ethereum does
    currencySymbol: 'BTC',
    blockExplorerUrl: 'https://www.blockchain.com/explorer', // A popular Bitcoin block explorer
    networkImage: bitcoin,
    accountType: 'BTC',
  },
  {
    networkName: 'Tron',
    rpcUrl: 'https://api.trongrid.io/',
    chainID: 1000,
    currencySymbol: 'TRX',
    blockExplorerUrl: 'https://tronscan.org/#',
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
