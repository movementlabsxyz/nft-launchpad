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

import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin  } from '@react-oauth/google';
import axios from "axios"

export default function ProtectedPage() {
  const { data: session } = useSession()

  const [myCollections, setMyCollections] = useState<any>([]);

  const [showUploadingItemsModal, setShowUploadingItemsModal] = useState(false);
  const [detailsShow, setDetailsShow] = useState(false);
  const [selectedCollectionDetails, setSelectedCollectionDetails] = useState<CollectionData | null>(null);

  const [stateData, setStateData] = useState<StateInfo | null>(null);

  const [creatorJwt, setCreatorJwt] = useState<string | null>(null);

  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState<any>(null);

  // when window is ready
  useEffect(() => {
    let item = localStorage.getItem("creator-jwt");
    item && setCreatorJwt(item);
  }, [])
  
  const login = useGoogleLogin({
      onSuccess: (codeResponse: any) => {
        console.log("codeResponse =", codeResponse);
        setUser(codeResponse)
      },
      onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${(user as any).access_token}`, {
              headers: {
                  Authorization: `Bearer ${(user as any).access_token}`,
                  Accept: 'application/json'
              }
          })
          .then((res) => {
            console.log("profile ", res.data);
              setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [ user ]
  );

  const verifySession = async () => {
    if (!profile?.email) return;

    let jwt = await verifyCreator(profile?.email);
    console.log("sign jwt =", jwt);

    localStorage.setItem("creator-jwt", jwt);
    setCreatorJwt(jwt);
  }

  useEffect(() => {
    setCreatorJwt(null);
    if (profile?.email) {
      verifySession()
    }
  }, [profile?.email])

  
  useEffect(() => {
    w3_getState().then((data) => {
      setStateData(data);
      console.log("data =", data);
    })
  }, []);

  useEffect(() => {
    if (profile?.email && stateData) {
      getCollectionsApi(profile?.email).then(data => {
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
  }, [profile?.email, stateData])
  

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
        {
          !profile ? 
            <button onClick={() => login()} type="button" className="text-white dark:text-gray-900 float-right bg-[#4285F4] hover:bg-[#4285F4]/90 dark:bg-gray-400 dark:hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
              <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
              </svg>
              Sign in with Google
            </button> 
          : 
            <button className="text-blue-600 text-lg float-right" onClick={() => setProfile(null)}>Log out</button>
        }
        <div className="w-full text-center mt-4 dark:text-white">
          <h3>Access Denied</h3>
          <p>
            { !profile ? (<span>You must be signed in to view this page</span>) : 
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
          <div className="float-right">
            <button className="rounded-lg px-5 py-2.5 text-center text-white bg-blue-500 text-lg" onClick={() => setProfile(null)}>You are signed in with {profile?.email}</button>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="mb-2 mt-3 text-red-950 px-3 text-lg underline dark:text-white"> My Collections </div>
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
        profile={profile}
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
