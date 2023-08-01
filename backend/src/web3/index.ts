
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

export const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
export const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";

const client = new AptosClient(NODE_URL);

export const w3_create_collection = async ({
  total_supply,
  mint_price,
  desc,
  name,
  logo_uri,
  jsons_uri
}: any) => {

  const triggerAccount = new AptosAccount(
    new HexString(process.env.TRIGGER_PRIV_KEY).toUint8Array()
  );
  
  console.log(`trigger: ${triggerAccount.address()}`);

  const payload: any = {
    type: 'entry_function_payload',
    function: `${process.env.CONTRACT_ADDRESS}::main::create_collection`,
    arguments: [
      total_supply,
      mint_price,
      desc,
      name,
      "https://ipfs.bluemove.net/uploads/datablaze-starter-pack/logo.webp",//logo_uri,
      jsons_uri
    ],
    type_arguments: [],
  };

  const rawTxn = await client.generateTransaction(triggerAccount.address(), payload);
  const bcsTxn = await client.signTransaction(triggerAccount, rawTxn);
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