import WalletSelectorAntDesign from "../components/WalletSelectorAntDesign"
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import Layout from "../components/layout"
import NftCard from "../components/NftCard"
import { useEffect, useState } from "react";
import { CollectionData, getCollectionsApi } from "../api/collections";
import CollectionCard from "../components/CollectionCard";
import CollectionDetails from "../components/CollectionDetails";

export default function IndexPage() {
  const [collections, setCollections] = useState<any>([]);
  const [updateData, toggleUpdate] = useState(true);
  const [detailsShow, setDetailsShow] = useState(false);
  const [selectedCollectionDetails, setSelectedCollectionDetails] = useState<CollectionData | null>(null);

  useEffect(() => {
    getCollectionsApi().then(data => {
      setCollections(data);
      console.log("load collections data=", data)
    })
  }, [updateData])

  const onCollectionCardClick = (colData: any) => {
    setDetailsShow(true);
    setSelectedCollectionDetails(colData);
  }

  return (
    <>
      <div className="flex flex-col px-5">
        <div className="flex justify-end float-right mb-3">
          <WalletSelectorAntDesign/>
        </div>
        { 
          collections && collections?.length > 0? 
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 ">
            { 
              collections.map((colData: any) => (
                <CollectionCard data={colData} onClick={() => onCollectionCardClick(colData)}/>
              ))
            } 
          </div> : <div className="flex justify-center text-lg w-full">No Collections yet</div> 
        }
      </div>

      <CollectionDetails
        show={detailsShow}
        details={selectedCollectionDetails}
        onCloseModal={() => setDetailsShow(false)}
      />
    </>
  )
}