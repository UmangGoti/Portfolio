import * as bip39 from "bip39";
import { Buffer } from "buffer";
import hdkey from "hdkey";
import { hdkey as _ethHdkey } from "ethereumjs-wallet";
import TronWeb from "@sekah/tronweb-rn";
import { Wallet } from "ethers";
import solanaWeb3 from "@solana/web3.js";

export async function createWalletMnemonic() {
  return await new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const mnemonic = bip39.generateMnemonic();
        let seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
        resolve({ mnemonic, seed });
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
        let seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
        const seedBuffer = Buffer.from(seed, "hex");
        const rootKey = _ethHdkey.fromMasterSeed(seedBuffer);
        const hardenedKey = rootKey.derivePath("m/44'/60'/0'/0");

        const childKey = hardenedKey.deriveChild(index);
        const wallet = childKey.getWallet();
        const address = wallet.getChecksumAddressString();
        const privateKey = wallet.getPrivateKey().toString("hex");
        resolve({ address, privateKey });
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
        let seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
        const seedBuffer = Buffer.from(seed, "hex");
        const rootKey = hdkey.fromMasterSeed(seedBuffer);

        const childKey = rootKey.derive("m/44'/195'/0'/0/" + index);
        const privateKey = childKey.privateKey.toString("hex");

        const tronWeb = new TronWeb({
          fullHost: "https://api.trongrid.io",
          privateKey: privateKey,
        });

        const address = tronWeb.defaultAddress.base58;
        resolve({ address, privateKey });
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
        let seed = bip39.mnemonicToSeedSync(mnemonic).toString("hex");
        const userSeed = crypto
          .createHash("sha256")
          .update(seed)
          .update(index.toString())
          .digest();

        let keypair = solanaWeb3.Keypair.fromSeed(userSeed.slice(0, 32));
        const address = keypair.publicKey.toString();
        const privateKey = Buffer.from(keypair.secretKey).toString("hex");
        resolve({ address, privateKey });
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
