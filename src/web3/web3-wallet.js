import TronWeb from "@sekah/tronweb-rn";
import solanaWeb3 from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { Buffer } from "buffer";
import { hdkey as _ethHdkey } from "ethereumjs-wallet";
import { Wallet } from "ethers";
import hdkey from "hdkey";

export async function createWalletMnemonic() {
  return await new Promise((resolve, reject) => {
    try {
      const mnemonic = generateMnemonic();
      let seed = mnemonicToSeedSync(mnemonic).toString("hex");
      resolve({ mnemonic, seed });
    } catch (error) {
      reject(error);
    }
  });
}

export async function createEVMWallet(mnemonic, index) {
  return await new Promise((resolve, reject) => {
    try {
      let seed = mnemonicToSeedSync(mnemonic).toString("hex");
      const seedBuffer = Buffer.from(seed, "hex");
      const masterSeed = _ethHdkey.fromMasterSeed(seedBuffer);
      const hardenedKey = masterSeed.derivePath("m/44'/60'/0'/0");

      const derivedChild = hardenedKey.deriveChild(index);
      const wallet = derivedChild.getWallet();
      const address = wallet.getChecksumAddressString();
      const privateKey = wallet.getPrivateKey().toString("hex");
      resolve({ address, privateKey, mnemonic });
    } catch (error) {
      reject(error);
    }
  });
}

export async function createTrxWallet(mnemonic, index) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let seed = mnemonicToSeedSync(mnemonic).toString("hex");
        const seedBuffer = Buffer.from(seed, "hex");
        const masterSeed = hdkey.fromMasterSeed(seedBuffer);

        const child = masterSeed.derive("m/44'/195'/0'/0/" + index);
        const privateKey = child.privateKey.toString("hex");

        const tronWeb = new TronWeb({
          fullHost: "https://api.trongrid.io",
          privateKey: privateKey,
        });

        const address = tronWeb.defaultAddress.base58;
        resolve({ address, privateKey, mnemonic });
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
        let seed = mnemonicToSeedSync(mnemonic).toString("hex");
        const userSeed = crypto
          .createHash("sha256")
          .update(seed)
          .update(index.toString())
          .digest();

        let keypair = solanaWeb3.Keypair.fromSeed(userSeed.slice(0, 32));
        const address = keypair.publicKey.toString();
        const privateKey = Buffer.from(keypair.secretKey).toString("hex");
        resolve({ address, privateKey, mnemonic });
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
        const masterSeed = mnemonicToSeedSync(mnemonic, "");

        const rootKey = hdkey.fromMasterSeed(masterSeed);

        let node = rootKey.derive("m/44'/0'/0'/0/" + index);

        let btc = bitcoin.payments.p2wpkh({
          pubkey: node.publicKey,
          network: network,
        });
        const privateKeyHex = node.privateKey.toString("hex");
        resolve({ address: btc.address, privateKey: privateKeyHex, mnemonic });
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
        resolve({ address: wallet?.address });
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
          fullHost: "https://api.trongrid.io",
          privateKey: privateKey,
        });

        const address = tronWeb.defaultAddress.base58;
        resolve({ address });
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
          Buffer.from(privateKey, "hex")
        );
        const keypair = solanaWeb3.Keypair.fromSecretKey(privateKeyBuffer);
        const address = keypair.publicKey.toString();
        resolve({ address });
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}

export async function importBtcAccount(privateKey) {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const network = bitcoin.networks.bitcoin;
        const privateKeyHex = privateKey;
        const privateKeyBuffer = Buffer.from(privateKeyHex, "hex");
        const keyPair = bitcoin.ECPair.fromPrivateKey(privateKeyBuffer, {
          network,
        });
        const { address } = bitcoin.payments.p2pkh({
          pubkey: keyPair.publicKey,
          network,
        });
        resolve({ address });
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
}
