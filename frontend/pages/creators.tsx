import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import { SocialConnect } from "../components/social-connect"
import Button from "../components/Button"
import ModalUploadingFiles from "../components/CreateCollection"
import NftCard from "../components/NftCard"
import { CollectionData, getCollectionsApi } from "../api/collections";
import CollectionCard from "../components/CollectionCard"
import CollectionDetails from "../components/CollectionDetails"

export default function ProtectedPage() {
  const { data: session } = useSession()

  const [myCollections, setMyCollections] = useState<any>([]);

  const [showUploadingItemsModal, setShowUploadingItemsModal] = useState(false);
  const [detailsShow, setDetailsShow] = useState(false);
  const [selectedCollectionDetails, setSelectedCollectionDetails] = useState<CollectionData | null>(null);


  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  useEffect(() => {
    setTimeout(() => {
      setItems([]);
    }, 3000);
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      getCollectionsApi(session?.user?.email).then(data => {
        if (data) setMyCollections(data);
        console.log("useEffect data=", data)
      })
    }
  }, [session])

  const onCreateSuccess = (newCollectionInfo: any) => {
    setShowUploadingItemsModal(false);
    setMyCollections([...myCollections, newCollectionInfo]);
  }

  const onCollectionCardClick = (colData: any) => {
    setDetailsShow(true);
    setSelectedCollectionDetails(colData);
  }

  // If no session exists, display access denied message
  /*if (!session) {
    return (
      <Layout>
        <h1> For Creators </h1>
        <SocialConnect/>
        <AccessDenied />
      </Layout>
    )
  }*/

  // If session exists, display content
  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <Button 
            className="mt-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => setShowUploadingItemsModal(true)}
          >
            + Create Collection
          </Button>
          <div className="w-1/3">
            <SocialConnect/>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="mb-3 text-red-950 px-3 text-lg"> Your Collections </div>
          <div className="">
              { 
                myCollections && myCollections?.length > 0? 
                <div className="grid grid-cols-3 gap-6 sm:grid-cols-3">
                  { 
                    myCollections.map((colData: any) => (
                      <CollectionCard data={colData} onClick={() => onCollectionCardClick(colData)}/>
                    ))
                  } 
              </div> : <div className="flex justify-center text-lg w-full">No Collections</div> 
            }
          </div>
        </div>
      </div>
      
      <ModalUploadingFiles
        show={showUploadingItemsModal}
        onOk={onCreateSuccess}
        onCloseModal={() => {
          setShowUploadingItemsModal(false);
        }}
      />

      <CollectionDetails
        show={detailsShow}
        details={selectedCollectionDetails}
        onCloseModal={() => setDetailsShow(false)}
        noMint={true}
      />
    </Layout>
  )
}
