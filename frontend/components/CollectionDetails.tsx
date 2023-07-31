import { useState, useEffect } from "react";
// import folderShapeSVG from "/images/folder-svgrepo-com.svg";
import {
  UPLOADING_FILE_TYPES,
  pinDirectoryToPinata,
  pinUpdatedJSONDirectoryToPinata,
} from "../utils/pinatasdk";
import NcModal from "./NcModal";
import { toast } from "react-toastify";
import ButtonPrimary from "./ButtonPrimary";
import { Backdrop, CircularProgress } from "@mui/material";
import { createCollectionApi } from "../api/collections";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { w3_mint_nft } from "../utils/web3";

const CollectionDetails = ({
  show,
  onOk,
  onCloseModal,
  details
}: any) => {
  const wallet = useWallet();

  const mintNft = () => {
    if (!wallet?.account?.address) {
      console.log("wallet error");
      return;
    }
    let collection_name = details.collectionName;
    let nft_name = details.collectionName + " #1";
    let nft_uri = details.uri + "/1";
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
      <a href="#" className="w-full h-full">
          <img className="rounded-t-lg" src="https://flowbite.com/docs/images/blog/image-1.jpg" alt="" />
      </a>
      <div className="p-5">
          <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
          <p>Total Minted ( 450 / 10000)</p>
          <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-gray-700">
            <div className="bg-purple-600 h-5 rounded-full dark:bg-purple-500" 
            style={{width: "4%"}}></div>
          </div>
          <p>Mint Price: {details?.mintPrice ?? 0} APT</p>
          <ButtonPrimary
            className="w-1/3 mt-2 max-h-[40px] text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
            onClick={mintNft}
          >
            Mint
          </ButtonPrimary>
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
