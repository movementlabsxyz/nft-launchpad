
import NcModal from "./NcModal";
import { toast } from "react-toastify";
import ButtonPrimary from "./ButtonPrimary";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AptosDecimalToNoDecimal, getCurrentSupply, w3_mint_nft } from "../utils/web3";
import { use, useEffect, useMemo, useState } from "react";

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
      .then((res) => {
        if (res) 
          toast.success("NFT Minted Successfully! Check your wallet please.");
      })
      .catch(() => {
        toast.error("Wallet sign and submit failed");
      })
  }

  const [currentSupply, setCurrentSupply] = useState(0);
  const progressValue = useMemo(() => (
    details?.total_supply ? (currentSupply / Number(details?.total_supply) * 100) : 100
  ), [currentSupply, details?.total_supply])

  useEffect(() => {
    if (details?.name) {
      getCurrentSupply({ 
        collectionName: details.name
      }).then(supply => {
        setCurrentSupply(supply);
      });
    } else {
      setCurrentSupply(0);
    }
  }, [details?.name])

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
          <p className="text-center text-lg mb-2">Total Minted ( {currentSupply} / {details?.total_supply ?? "Infinity"})</p>
          <div className="w-full bg-gray-200 rounded-full h-5 dark:bg-gray-700">
            <div className="bg-purple-600 h-5 rounded-full dark:bg-purple-500" 
            style={{width: `${progressValue}%`}}></div>
          </div>
          <p className="text-lg text-red-950 mt-5">Mint Price: {AptosDecimalToNoDecimal(details?.mint_price)} APT</p>
          { !noMint ? <ButtonPrimary
            className="w-full mt-2 max-h-[60px] text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
            onClick={mintNft}
          >
            Mint
          </ButtonPrimary> : 
          <div>
            <span>Earned Money: {AptosDecimalToNoDecimal(details?.value?.earned_coins.value)} APT</span>
          </div>}
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
