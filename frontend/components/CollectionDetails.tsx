
import NcModal from "./NcModal";
import { toast } from "react-toastify";
import ButtonPrimary from "./ButtonPrimary";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { w3_mint_nft } from "../utils/web3";

const CollectionDetails = ({
  show,
  onOk,
  onCloseModal,
  details,
  noMint
}: any) => {
  const wallet = useWallet();

  const mintNft = () => {
    if (!wallet?.account?.address || !details) {
      console.log("wallet error");
      return;
    }
    let collection_name = details.name;
    let nft_name = details.name + " #1";
    let nft_uri = details.jsons_uri + "/1.json";
    w3_mint_nft({
      collection_name,
      nft_name,
      nft_uri
    }, wallet)
      .then(() => {
        toast.success("NFT Minted Successfully! Check your wallet please.");
      })
      .catch(() => {
        toast.error("NFT Minting failed");
      })
  }

  const renderContent = () => (
    <div className="flex w-full h-full bg-white">
      <a href="#" className="w-6/12 h-full">
          <img className="rounded-t-lg" src={details?.logo_uri ?? (details?.images_uri + "/1.png")} alt="" />
      </a>
      <div className="p-5 w-6/12">
          <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{details?.name ?? "NFT Collection"}</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {details?.desc ?? "Description"}
          </p>
          <p className="text-center text-lg mb-2">Total Minted ( 450 / 10000)</p>
          <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-gray-700">
            <div className="bg-purple-600 h-5 rounded-full dark:bg-purple-500" 
            style={{width: "4%"}}></div>
          </div>
          <p className="text-lg text-red-950 mt-5">Mint Price: {details?.mint_price ?? 0} APT</p>
          { !noMint ? <ButtonPrimary
            className="w-full mt-2 max-h-[60px] text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
            onClick={mintNft}
          >
            Mint
          </ButtonPrimary> : <></>}
      </div>
    </div>
  );

  const renderTrigger = () => {
    return null;
  };

  return (
    <NcModal
      isOpenProp={show}
      onCloseModal={onCloseModal}
      contentExtraClass="max-w-screen-lg"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle="Create Collection"
    />
  );
};

export default CollectionDetails;
