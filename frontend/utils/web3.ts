
import { 
  AptosAccount, 
  TxnBuilderTypes, 
  BCS, 
  MaybeHexString, 
  HexString, 
  AptosClient, 
  FaucetClient,
  Provider,
  Types
} from "aptos";
import assert from 'assert';
import 'dotenv/config'
import { sha3_256 as sha3Hash } from "@noble/hashes/sha3";

export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
export const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
const DefaultContractAddress = "0x78bbaf217f3bd5891fddca17af38951450cde1e9c73d2688e479422f12c86b41";
const DefaultCreatorAddress = "0x20236e071ba6882f9168f2bd4094fcab1ce04744bd941ad5adc11caa946fe179";

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

  const transactionRes = await wallet.signAndSubmitTransaction(payload);
  try {
    await client.waitForTransaction(transactionRes.hash, {
      checkSuccess: true
    });
    return transactionRes.hash
  } catch {
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

  const transactionRes = await wallet.signAndSubmitTransaction(payload);
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

  const transactionRes = await wallet.signAndSubmitTransaction(payload);
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

export const w3_withdrawTax = async (wallet: any) => {
  const payload: any = {
    type: 'entry_function_payload',
    function: `${process.env.CONTRACT_ADDRESS ?? DefaultContractAddress}::main::withdraw_tax`,
    arguments: [],
    type_arguments: [],
  };

  const transactionRes = await wallet.signAndSubmitTransaction(payload);
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

  const transactionRes = await wallet.signAndSubmitTransaction(payload);
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

// view functions
export const getCurrentSupply = async (params: {
  collectionAddress?: string,
  collectionName?: string
}): Promise<number> => {
  if (!params.collectionName && !params.collectionAddress) return 0;
  let objectAddress = params.collectionAddress;
  if (!params.collectionAddress) {
    objectAddress = getCollectionAddress(params.collectionName!);
  }
  const payload: Types.ViewRequest = {
    function: '0x4::collection::count',
    type_arguments: ["0x4::collection::Collection"],
    arguments: [new HexString(objectAddress!).hex()]
  };
  const result = await client.view(payload);
  return parseInt(BigInt((result as any)[0].vec).toString());
}

export function stringToHex(text: string) {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  return Array.from(encoded, (i) => i.toString(16).padStart(2, "0")).join("");
}

export function noDecimalToAptosDecimal(value: string | number) {
  let val = Number(value) * Math.pow(10, 8);
  return val.toFixed(0)
}

export function AptosDecimalToNoDecimal(value: string | number | undefined) {
  let val = Number(value ?? 0) / Math.pow(10, 8);
  return parseFloat(val.toFixed(3))
}