import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import { SocialConnect } from "../components/social-connect"
import Button from "../components/Button"
import ModalUploadingFiles from "../components/CreateCollection"
import NftCard from "../components/NftCard"
import { getCollectionsApi } from "../api/collections";

export default function ProtectedPage() {
  const { data: session } = useSession()

  const [myCollections, setMyCollections] = useState<any>([]);

  const [showUploadingItemsModal, setShowUploadingItemsModal] = useState(false);


  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  useEffect(() => {
    setTimeout(() => {
      setItems([]);
    }, 3000);
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      getCollectionsApi(session?.user?.email).then(data => {
        setMyCollections(data);
        console.log("useEffect data=", data)
      })
    }
  }, [session])

  const onCreateSuccess = (newCollectionInfo: any) => {
    /**
     {
      "id": 3,
      "creator_email": "blockchainlover2019@gmail.com",
      "creator_name": "Crypto Lover",
      "creator_image": "https://lh3.googleusercontent.com/a/AAcHTtfmz8hV6wedIjs6mPanPFI46zJaiCNqZ6y3phiW52MHlY8=s96-c",
      "name": "dasdf",
      "mint_price": "1",
      "total_supply": 5,
      "images_cid": "QmSY7w5LUQ26Bcmn5X2BEBnvBJfdjhCxVfBhQyhEWbBFY5",
      "jsons_cid": "QmbyGSk47ywAAKMLjMy6UeYA12UzDyJAJq4WUsbPQynHqo",
      "uri": "QmbyGSk47ywAAKMLjMy6UeYA12UzDyJAJq4WUsbPQynHqo",
      "tx_hash": "0xd7a1dde2b350f62aeaeceb01c5a0f9d8f2020ead6c504cd8004069615eb1e882",
      "updatedAt": "2023-07-29T19:50:48.882Z",
      "createdAt": "2023-07-29T19:50:48.882Z",
      "desc": null
    }
     */
    setShowUploadingItemsModal(false);
    setMyCollections([...myCollections, newCollectionInfo]);
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
        <SocialConnect/>
        <Button 
          className="float-right mt-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          onClick={() => setShowUploadingItemsModal(true)}
        >
          + Create Collection
        </Button>
        <div className="flex flex-col">
          <div className="mb-3"> Your Collections </div>
          <div className="">
          { 
            items.length > 0? 
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              { 
                items.map(() => (
                  <NftCard/>
                ))
              } 
            </div> : <div className="flex justify-center text-lg w-full">You didn't create any collections</div> 
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
    </Layout>
  )
}
