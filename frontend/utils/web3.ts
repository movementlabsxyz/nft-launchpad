
import { 
  AptosAccount, 
  TxnBuilderTypes, 
  BCS, 
  MaybeHexString, 
  HexString, 
  AptosClient, 
  FaucetClient,
} from "aptos";
import assert from 'assert';
import 'dotenv/config'
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";

export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
export const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const DefaultContractAddress = "0x4477072c2c9867029b336fd96e27c8f33fcf56088dc3245fce4905e4646e2286";
const DefaultCreatorAddress = "0xec7230d4acbfd48d01b920d5ab5e2644c4be6d1af8abea8dd080de414cbb8ff4";

const client = new AptosClient(NODE_URL);

export const w3_mint_nft = async ({
  collection_name,
  nft_name,
  nft_uri,
}: any, wallet: any) => {
  console.log(
    collection_name,
    nft_name,
    nft_uri
  );

  const payload: any = {
    type: 'entry_function_payload',
    function: `${process.env.CONTRACT_ADDRESS ?? DefaultContractAddress}::main::mint_token`,
    arguments: [
      collection_name,
      nft_name,
      nft_uri,
    ],
    type_arguments: [],
  };

  const bcsTxn = await wallet.signAndSubmitTransaction(payload);
  console.log("h2")
  const transactionRes = await client.submitTransaction(bcsTxn);
  console.log("h3")
  try {
    await client.waitForTransaction(transactionRes.hash, {
      checkSuccess: true
    });
    return transactionRes.hash
  } catch {
    console.log("transaction failed ", transactionRes?.hash);
    return null;
  }
}


export const w3_changeAdmin = async ({
  admin_address,
  trigger_address
}: any, wallet: any) => {
  console.log(admin_address);

  const payload: any = {
    type: 'entry_function_payload',
    function: `${process.env.CONTRACT_ADDRESS ?? DefaultContractAddress}::main::set_addresses`,
    arguments: [
      admin_address,
      trigger_address
    ],
    type_arguments: [],
  };

  const bcsTxn = await wallet.signAndSubmitTransaction(payload);
  const transactionRes = await client.submitTransaction(bcsTxn);
  try {
    await client.waitForTransaction(transactionRes.hash, {
      checkSuccess: true
    });
    return transactionRes.hash
  } catch {
    console.log("transaction failed ", transactionRes?.hash);
    return null;
  }
}

export const w3_changeTaxRate = async ({
  taxRate
}: any, wallet: any) => {
  const payload: any = {
    type: 'entry_function_payload',
    function: `${process.env.CONTRACT_ADDRESS ?? DefaultContractAddress}::main::set_tax_rate`,
    arguments: [
      taxRate
    ],
    type_arguments: [],
  };

  const bcsTxn = await wallet.signAndSubmitTransaction(payload);
  const transactionRes = await client.submitTransaction(bcsTxn);
  try {
    await client.waitForTransaction(transactionRes.hash, {
      checkSuccess: true
    });
    return transactionRes.hash
  } catch {
    console.log("transaction failed ", transactionRes?.hash);
    return null;
  }
}

export const w3_withdrawEarning = async ({
  collection_name,
  receiver
}: any, wallet: any) => {
  const payload: any = {
    type: 'entry_function_payload',
    function: `${process.env.CONTRACT_ADDRESS ?? DefaultContractAddress}::main::withdraw_earning`,
    arguments: [
      collection_name,
      receiver
    ],
    type_arguments: [],
  };

  const bcsTxn = await wallet.signAndSubmitTransaction(payload);
  const transactionRes = await client.submitTransaction(bcsTxn);
  try {
    await client.waitForTransaction(transactionRes.hash, {
      checkSuccess: true
    });
    return transactionRes.hash
  } catch {
    console.log("transaction failed ", transactionRes?.hash);
    return null;
  }
}

export const w3_getState = async () => {
  const resource = await client.getAccountResource(
    process.env.CONTRACT_ADDRESS ?? DefaultContractAddress, 
    `${process.env.CONTRACT_ADDRESS ?? DefaultContractAddress}::main::State`
  );
  return ( resource.data as StateInfo );
}

export type StateInfo = {
  admin_address: string,
  trigger_address: string,
  platform_tax_rate: string,
  tax_coins: { value: string },
  collections: {
    data: Array<{
      key: string,
      value: {
        earned_coins: { value: string },
        json_uri: string,
        mint_price: string
      }
    }>
  }
}

export const getCollectionAddress = (seedString: string): string => {
  const source = BCS.bcsToBytes(TxnBuilderTypes.AccountAddress.fromHex(DefaultCreatorAddress));

  const seed = new HexString(stringToHex(seedString)).toUint8Array();

  const originBytes = new Uint8Array(source.length + seed.length + 1);
  originBytes.set(source);
  originBytes.set(seed, source.length);
  originBytes.set([0xFE], source.length + seed.length);

  const hash = sha3Hash.create();
  hash.update(originBytes);

  return HexString.fromUint8Array(hash.digest()).toString();
}

export function stringToHex(text: string) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  return Array.from(encoded, (i) => i.toString(16).padStart(2, "0")).join("");
}