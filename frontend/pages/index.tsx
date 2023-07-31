import WalletSelectorAntDesign from "../components/WalletSelectorAntDesign"
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import Layout from "../components/layout"
import NftCard from "../components/NftCard"
import { useEffect, useState } from "react";
import { getCollectionsApi } from "../api/collections";
import CollectionCard from "../components/CollectionCard";
import CollectionDetails from "../components/CollectionDetails";

export default function IndexPage() {
  const [collections, setCollections] = useState<any>([]);
  const [updateData, toggleUpdate] = useState(true);
  const [detailsShow, setDetailsShow] = useState(false);

  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [selectedCollectionDetails, setSelectedCollectionDetails] = useState();

  useEffect(() => {
    setTimeout(() => {
      setItems([]);
    }, 3000);
  }, []);

  useEffect(() => {
    getCollectionsApi().then(data => {
      setCollections(data);
      console.log("load collections data=", data)
    })
  }, [updateData])

  const onCollectionCardClick = (colData: any) => {
    setDetailsShow(true);
    setSelectedCollectionDetails({
      collectionName: colData.name,
      uri: colData.uri,
      mintPrice: colData.mint_price,
    } as any);
  }

  return (
    <Layout>
      <div className="flex flex-col">
        <span className="text-4xl mb-5"> For Users </span>
        <div className="flex justify-end float-right mb-3">
          <WalletSelectorAntDesign/>
        </div>
        { 
          items.length > 0? 
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            { 
              items.map(() => (
                <NftCard/>
              ))
            } 
          </div> : <div className="flex justify-center text-lg w-full">No Collections yet</div> 
        }
        {
          collections.map((colData: any) => (
            <CollectionCard onClick={() => onCollectionCardClick(colData)}/>
          ))
        } 
      </div>

      <CollectionDetails
        show={detailsShow}
        details={selectedCollectionDetails}
        onCloseModal={() => setDetailsShow(false)}
      />
    </Layout>
  )
}