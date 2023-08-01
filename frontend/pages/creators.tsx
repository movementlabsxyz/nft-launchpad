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
import { verifyCreator } from "../api"
import { StateInfo, getCollectionAddress, w3_getState } from "../utils/web3"

export default function ProtectedPage() {
  const { data: session } = useSession()

  const [myCollections, setMyCollections] = useState<any>([]);

  const [showUploadingItemsModal, setShowUploadingItemsModal] = useState(false);
  const [detailsShow, setDetailsShow] = useState(false);
  const [selectedCollectionDetails, setSelectedCollectionDetails] = useState<CollectionData | null>(null);

  const [stateData, setStateData] = useState<StateInfo | null>(null);

  const [creatorJwt, setCreatorJwt] = useState(null);

  const verifySession = async () => {
    if (!session?.user?.email) return;

    let jwt = await verifyCreator(session?.user?.email);
    console.log("sign jwt =", jwt);
    setCreatorJwt(jwt);
  }

  useEffect(() => {
    setCreatorJwt(null);
    if (session?.user?.email) {
      verifySession()
    }
  }, [session?.user?.email])

  
  useEffect(() => {
    w3_getState().then((data) => {
      setStateData(data);
      console.log("data =", data);
    })
  }, []);

  useEffect(() => {
    if (session?.user?.email && stateData) {
      getCollectionsApi(session?.user?.email).then(data => {
        let collections: any = [];
        data?.forEach((d: any) => {
          let cAddy = getCollectionAddress(d.name);
          let collectionOnChain = stateData.collections.data.find((v) => v.key === cAddy);
          if (collectionOnChain)
            collections.push({ ...d, ...collectionOnChain });
        })
        setMyCollections(collections);
        console.log("setMyCollections =", collections)
      })
    }
  }, [session?.user?.email, stateData])
  

  const onCreateSuccess = (newCollectionInfo: any) => {
    setShowUploadingItemsModal(false);
    setMyCollections([...myCollections, newCollectionInfo]);
  }

  const onCollectionCardClick = (colData: any) => {
    setDetailsShow(true);
    setSelectedCollectionDetails(colData);
  }

  // If no session exists, display access denied message
  if (!creatorJwt) {
    return (
      <>
        <SocialConnect/>
        <div className="w-full text-center mt-4">
          <h3>Access Denied</h3>
          <p>
            { !session ? (<span>You must be signed in to view this page</span>) : 
              <span> You are not a creator! Please contact <a href="mailto:cooper@movementlabs.xyz">cooper@movementlabs.xyz</a> 
              </span> 
            }
          </p>
        </div>
      </>
    )
  }

  // If session exists, display content
  return (
    <>
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
          <div className="mb-2 mt-3 text-red-950 px-3 text-lg underline "> My Collections </div>
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
    </>
  )
}
