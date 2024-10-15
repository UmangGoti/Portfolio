import TronWeb from '@sekah/tronweb-rn';
import solanaWeb3 from '@solana/web3.js';
import {generateMnemonic, mnemonicToSeedSync} from 'bip39';
import * as bitcoin from 'bitcoinjs-lib';
import {Buffer} from 'buffer';
import {hdkey as _ethHdkey} from 'ethereumjs-wallet';
import {ethers, Wallet} from 'ethers';
import hdkey from 'hdkey';

export async function createWalletMnemonic() {
  return await new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const mnemonic = generateMnemonic();
        let seed = mnemonicToSeedSync(mnemonic).toString('hex');
        resolve({mnemonic, seed});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

export async function createEVMWallet(mnemonic, index) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let seed = mnemonicToSeedSync(mnemonic).toString('hex');
        const seedBuffer = Buffer.from(seed, 'hex');
        const masterSeed = _ethHdkey.fromMasterSeed(seedBuffer);
        const hardenedKey = masterSeed.derivePath("m/44'/60'/0'/0");

        const derivedChild = hardenedKey.deriveChild(index);
        const wallet = derivedChild.getWallet();
        const address = wallet.getChecksumAddressString();
        const privateKey = wallet.getPrivateKey().toString('hex');
        resolve({address, privateKey});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

export async function createTrxWallet(mnemonic, index) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let seed = mnemonicToSeedSync(mnemonic).toString('hex');
        const seedBuffer = Buffer.from(seed, 'hex');
        const masterSeed = hdkey.fromMasterSeed(seedBuffer);

        const child = masterSeed.derive("m/44'/195'/0'/0/" + index);
        const privateKey = child.privateKey.toString('hex');

        const tronWeb = new TronWeb({
          fullHost: 'https://api.trongrid.io',
          privateKey: privateKey,
        });

        const address = tronWeb.defaultAddress.base58;
        resolve({address, privateKey});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

export async function createSolWallet(mnemonic, index) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let seed = mnemonicToSeedSync(mnemonic).toString('hex');
        const userSeed = crypto
          .createHash('sha256')
          .update(seed)
          .update(index.toString())
          .digest();

        let keypair = solanaWeb3.Keypair.fromSeed(userSeed.slice(0, 32));
        const address = keypair.publicKey.toString();
        const privateKey = Buffer.from(keypair.secretKey).toString('hex');
        resolve({address, privateKey});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

export async function createBtcWallet(mnemonic, index) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const network = bitcoin.networks.bitcoin;
        const masterSeed = mnemonicToSeedSync(mnemonic, '');

        const rootKey = hdkey.fromMasterSeed(masterSeed);

        let node = rootKey.derive("m/44'/0'/0'/0/" + index);

        let btc = bitcoin.payments.p2wpkh({
          pubkey: node.publicKey,
          network: network,
        });
        const privateKeyHex = node.privateKey.toString('hex');
        resolve({address: btc.address, privateKey: privateKeyHex});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

export async function importEVMAccount(privateKey) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const wallet = new Wallet(privateKey);
        resolve({address: wallet?.address});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

export async function importTrxAccount(privateKey) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const tronWeb = new TronWeb({
          fullHost: 'https://api.trongrid.io',
          privateKey: privateKey,
        });

        const address = tronWeb.defaultAddress.base58;
        resolve({address});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

export async function importSolAccount(privateKey) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const privateKeyBuffer = Uint8Array.from(
          Buffer.from(privateKey, 'hex'),
        );
        const keypair = solanaWeb3.Keypair.fromSecretKey(privateKeyBuffer);
        const address = keypair.publicKey.toString();
        resolve({address});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

/**
 *
 * @param {string} privateKey
 * @returns
 */
export async function importBtcAccount(privateKey) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const network = bitcoin.networks.bitcoin;
        const privateKeyHex = privateKey;
        const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
        const keyPair = bitcoin.ECPair.fromPrivateKey(privateKeyBuffer, {
          network,
        });
        const {address} = bitcoin.payments.p2pkh({
          pubkey: keyPair.publicKey,
          network,
        });
        resolve({address});
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

/**
 * For getting balance of account
 * @param {string} address - '0x9F345e8973b01BBaF5d02DDdcE75dFbc4A616B72'
 * @param {string} rpcUrl
 * @param {string} accountType - 'ETH' | 'SOLANA' | 'BTC' | 'TRON'
 * @returns
 */
export async function getBalance(address, rpcUrl, accountType) {
  return await new Promise((resolve, reject) => {
    try {
      if (accountType === 'ETH') {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        provider
          .getBalance(address)
          .then(balance => {
            resolve(ethers.formatEther(balance));
          })
          .catch(error => {
            reject(error);
          });
      } else if (accountType === 'SOLANA') {
        const connection = new solanaWeb3.Connection(
          solanaWeb3.clusterApiUrl('mainnet-beta'),
        );
        const publicKey = new solanaWeb3.PublicKey(address);
        connection
          .getBalance(publicKey)
          .then(balance => {
            resolve(balance);
          })
          .catch(error => {
            reject(error);
          });
      } else if (accountType === 'BTC') {
        fetch(`https://blockstream.info/api/address/${address}`)
          .then(response => response.json())
          .then(response => {
            resolve(response.chain_stats.funded_txo_sum / 1e8);
          })
          .catch(error => {
            reject(error);
          });
      } else if (accountType === 'TRON') {
        const fullNodeUrl = 'https://api.trongrid.io';
        let tronWeb = new TronWeb({fullHost: fullNodeUrl});
        tronWeb.setFullNode(fullNodeUrl);
        tronWeb.setSolidityNode(fullNodeUrl);
        tronWeb.trx
          .getBalance(address)
          .then(balance => {
            resolve(tronWeb.fromSun(balance));
          })
          .catch(error => {
            reject(error);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
}
