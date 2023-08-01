import { useState, useEffect } from "react";
// import folderShapeSVG from "/images/folder-svgrepo-com.svg";
import {
  UPLOADING_FILE_TYPES,
  pinImgageDirectoryToPinata,
  pinFileToIPFS,
  pinUpdatedJSONDirectoryToPinata,
} from "../utils/pinatasdk";
import NcModal from "./NcModal";
import { toast } from "react-toastify";
import ButtonPrimary from "./ButtonPrimary";
import { Backdrop, CircularProgress } from "@mui/material";
import { createCollectionApi, DEFAULT_BASE_IPFS_GATEWAY } from "../api/collections";

import { useSession } from "next-auth/react"

const ST_NONE = 0;
const ST_UPLOADING = 1;
const ST_UPLOAD_FAILED = 2;
const ST_CREATING_COLLECTION = 3;
const ST_CREATING_FAILED = 4;
const ST_CREATING_SUCCESS = 5;

const UploadItems = ({
  show,
  onOk,
  onCloseModal
}) => {
  
  const { data: session } = useSession()

  const [imageFileList, setImageFileList] = useState([]);
  const [jsonFileList, setJsonFileList] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [working, setWorking] = useState(false);

  const [status, setCurrentStatus] = useState(ST_NONE);

  const [imageExtension, setImageExtension] = useState("");

  const [collectionName, setCollectionName] = useState("");
  const [collectionDesc, setCollectionDesc] = useState("");
  const [mintPrice, setMintPrice] = useState(1);

  const [cids, setCids] = useState([]);

  useEffect(() => {
    setImageFileList([]);
    setJsonFileList([]);
  }, [show]);

  const handleClickSubmitForm = () => {
    onOk();
  };

  const handleSelectImagesFolder = (filelist) => {
    setImageFileList(filelist);
    let splitedArr = filelist[0]?.name.toString().split(".") || "";
    var imageExt = splitedArr[splitedArr.length - 1] || "";
    setImageExtension(imageExt);
  };

  const updateJson = (json, replsceImgStr) => {
    let updated = json;
    updated["image"] = replsceImgStr;
    return updated;
  };

  const handleSelectJsonsFolder = async (filelist) => {
    let updatingJSONList = [];
    for (let i = 0; i < filelist.length; i++) {
      const file = filelist[i];

      // Read the file
      const fileContent = await file.text();

      updatingJSONList.push(fileContent);
    }
    setJsonFileList(updatingJSONList);
  };

  const handleCollectionLogoImage = (file) => {
    console.log("fileN =", file)
    setLogoFile(file);
  }

  const onChangeMintPrice = (e) => {
    let value = e.target.value;
    if (isNaN(parseFloat(value))) 
      value = 0;
    setMintPrice(value)
  }

  const createCollection = async (imagesCid, jsonsCid, logoCid) => {
    if (
      !session?.user?.email
      || !session?.user?.name
    ) {
      console.log("session expired");
      return false;
    }
    
    setCurrentStatus(ST_CREATING_COLLECTION);

    let totalSupply = imageFileList?.length ?? 0;

    let newCollectionData = await createCollectionApi(
      session?.user?.email,
      session?.user?.name,
      session?.user?.image ?? "",
      collectionName.trim(),
      collectionDesc.trim(),
      mintPrice,
      totalSupply,
      imagesCid ?? cids[0],
      jsonsCid ?? cids[1],
      logoCid
    );
    
    if (newCollectionData) {
      setCurrentStatus(ST_CREATING_SUCCESS);
      toast.success(
        <div>
          {`Successfully Created a Collection.`}
        </div>,
        "Creating is succeed",
        20000
      );
    }
    else {
      setCurrentStatus(ST_CREATING_FAILED);
      toast.error(
        <div>
          {`Failed in Creating a new Collection.`}
        </div>,
        "Creating is failed",
        20000
      );
    }

    setTimeout(() => onOk(newCollectionData), 500);
  }

  const handleUploadAll = async () => {
    if (!session?.user?.email) {
      console.log("session error");
      return;
    }
    if (collectionName.trim() === "") {
      console.log("error")
      toast.warn("Please input collection name and try again.", "Warning", 5000);
      setWorking(false);
      return;
    }
    if (parseFloat(mintPrice) === 0) {
      toast.warn("Please input mintPrice correctly and try again.", "Warning", 5000);
      setWorking(false);
      return;
    }
    if (imageFileList?.length > 0 && jsonFileList?.length > 0) {
      if (imageFileList?.length !== jsonFileList?.length) {
        toast.error("Number of image files and json files should be equal");
        return;
      }
    } else {
      toast.error("Please select folders correctly");
      return;
    }
    if (imageFileList?.length > 0) {
      setWorking(true);
      setCurrentStatus(ST_UPLOADING);

      console.log("imageFileList =", imageFileList);
      console.log("logoFile =", logoFile);

      let logoCid = null;
      /*if (logoFile?.length > 0) {
        logoCid = await pinFileToIPFS(logoFile);
        console.log("logoCid =", logoCid);
      }*/

      let cid = await pinImgageDirectoryToPinata(
        imageFileList,
        logoFile,
        UPLOADING_FILE_TYPES.OTHERS
      );
      console.log("cid =", cid);
      if (cid !== null) {
        const imagesFolderCid = cid;
        if (logoFile?.length > 0) {
          logoCid = cid + "/logo.png";
        }
        var updatedJsonList = [];
        for (let idx = 0; idx < jsonFileList.length; idx++) {
          const json = JSON.parse(jsonFileList[idx]);
          const updatedJson = updateJson(
            json,
            `${DEFAULT_BASE_IPFS_GATEWAY}${imagesFolderCid}/${idx}.${imageExtension}`
          );
          const updatedFileContent = JSON.stringify(updatedJson);
          updatedJsonList.push(updatedFileContent);
        }
        if (updatedJsonList?.length > 0) {
          setWorking(true);
          let cidOfJsonFolder = await pinUpdatedJSONDirectoryToPinata(
            updatedJsonList,
            UPLOADING_FILE_TYPES.JSON
          );
          if (cidOfJsonFolder !== null) {
            toast.success(
              <div>
                {`You 've uploaded a folder of json files to ipfs store.\n
                  Creating a Collection on Chain now.`}
              </div>,
              "Uploading is succeed",
              20000
            );
            
            console.log("success imagesFolderCid =", imagesFolderCid, "cidOfJsonFolder =", cidOfJsonFolder);
            
            
            setCids([imagesFolderCid, cidOfJsonFolder, logoCid]);

            // create collection
            await createCollection(imagesFolderCid, cidOfJsonFolder, logoCid);
          
          } else {
            toast.error(
              <div>
                {`Error occured while uploading to ipfs`}
              </div>,
              "Uploading failed",
              5000
            );
            setCurrentStatus(ST_UPLOAD_FAILED);
          }
          // setJsonFileList([]);
          setWorking(false);
        }
      }
      // setImageFileList([]);
      setWorking(false);
    }
  };

  const renderContent = () => {
    return (
      <div className="flex flex-col items-center">
        {/* input */}
        <div className="mb-5">
          <div className="flex mb-2">  
            <span className=" w-full p-1">Collection Name(*) :</span>
            <input type="text" className=" w-full border-gray-200 border-2 p-1"
              value={collectionName} 
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </div>
          <div className="flex mb-2">  
            <span className=" w-full p-1">Collection Description :</span>
            <textarea type="text" className=" w-full border-gray-200 border-2 p-1"
              value={collectionDesc} 
              onChange={(e) => setCollectionDesc(e.target.value)}
            />
          </div>
          <div className="flex mb-2">  
            <span className=" w-full p-1">Mint Price(*) :</span>
            <div className="flex w-full">
              <input 
                type="text" 
                className="w-full border-gray-200 border-2 p-1 text-right" 
                placeholder="1"
                value={mintPrice}
                onChange={onChangeMintPrice}
              />
              <span className="p-1">APT</span>
            </div>
          </div>
          <div className="flex mb-2">  
            <span className=" w-full p-1">Collection Logo :</span>
            <input type="file" className=" w-full border-gray-200 border-2 p-1"
              onChange={(e) => handleCollectionLogoImage(e.target.files)}
            ></input>
          </div>
        </div>
        {/* upload */}
        <div className="flex p-2">
          <div className="w-5/12 flex flex-col items-center ">
            <div className="space-y-1 text-center z-5 relative w-full">
              <img
                className="w-12 h-12 mx-auto text-neutral-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
                src={"/images/folder-svgrepo-com.svg"}
                alt="folder"
              />
              <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300 w-full">
                <span className="text-green-500">
                  Select a folder of image files
                </span>
                <label
                  htmlFor="image_upload"
                  className=" font-medium rounded-md cursor-pointer text-primary-6000 transition hover:text-primary-500  absolute top-0 left-25 z-5 w-[100px] h-[100px]"
                >
                  <input
                    id="image_upload"
                    type="file"
                    webkitdirectory="true"
                    mozdirectory="true"
                    msdirectory="true"
                    odirectory="true"
                    directory="true"
                    multiple="true"
                    className="z-0 hidden"
                    onChange={(e) => handleSelectImagesFolder(e.target.files)}
                  />
                </label>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {`${imageFileList?.length || 0} files in the folder`}
              </p>
            </div>
            {/* <div className="my-5 text-[#afafaf]  flex relative">
              {cidOfImagesFolder !== "" && (
                <>
                  CID: {cidOfImagesFolder}
                  <CopyToClipboard
                    text={cidOfImagesFolder}
                    className="w-5 h-5 cursor-pointer absolute z-10"
                  >
                    <img
                      src={copyBtnPNg}
                      className="w-5 h-5 absolute z-10"
                      alt="copy"
                    />
                  </CopyToClipboard>
                </>
              )}
            </div> */}
          </div>
          <div className="w-2/12 flex flex-col items-center "></div>
          <div className="w-5/12 flex flex-col items-center ">
            <div className="space-y-1 text-center z-5 relative w-full">
              <img
                className="w-12 h-12 mx-auto text-neutral-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
                src={"/images/folder-svgrepo-com.svg"}
                alt="folder"
              />
              <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300 w-full">
                <span className="text-green-500">
                  Select a folder of json files
                </span>
                <label
                  htmlFor="json_upload"
                  className="font-medium rounded-md cursor-pointer text-primary-6000 transition hover:text-primary-500  absolute top-0 left-10 z-5  w-[100px] h-[100px]"
                >
                  <input
                    id="json_upload"
                    type="file"
                    webkitdirectory="true"
                    mozdirectory="true"
                    msdirectory="true"
                    odirectory="true"
                    directory="true"
                    multiple="true"
                    className="z-0 hidden"
                    onChange={(e) => handleSelectJsonsFolder(e.target.files)}
                  />
                </label>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {`${jsonFileList?.length || 0} files in the folder`}
              </p>
            </div>
            {/* <div className="my-5 text-[#afafaf] flex relative">
              {cidOfJsonsFolder !== "" && (
                <>
                  CID: {cidOfJsonsFolder}
                  <CopyToClipboard
                    text={cidOfJsonsFolder}
                    className="w-5 h-5 cursor-pointer absolute z-10"
                  >
                    <img
                      src={copyBtnPNg}
                      className="w-5 h-5 absolute z-10"
                      alt="copy"
                    />
                  </CopyToClipboard>
                </>
              )}
            </div> */}
          </div>
        </div>          
          
        <ButtonPrimary
          className="w-1/3 mt-2 max-h-[40px] text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
          onClick={() => {
            handleUploadAll();
          }}
        >
          Create Collection
        </ButtonPrimary>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={working}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="flex w-9/12 mt-4">
          <div className="w-5/12 mr-3">
            <ol class="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">                  
              <li class="mb-10 ml-6">            
                  { status > ST_UPLOAD_FAILED ? 
                      <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                          <svg class="w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                          </svg>
                      </span> : 
                      (status <= ST_UPLOADING ? 
                        <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                          { status === ST_UPLOADING ?
                            <svg aria-hidden="true" class="inline w-full h-full p-1 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg> :
                            <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z"/>
                            </svg>
                          }
                        </span>:
                        <span class="absolute flex items-center justify-center w-8 h-8 bg-red-400 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-red-700">
                          <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z"/>
                          </svg>
                        </span>)
                  }
                  <h3 class="font-medium leading-tight">Upload Files</h3>
                  <p class="text-sm">{ status === ST_UPLOADING ? "Uploading to ipfs" 
                    : ( status === ST_CREATING_COLLECTION || status === ST_CREATING_FAILED ? "Upload finished successfully" 
                    : ( status === ST_UPLOAD_FAILED ? ( <>Failed <a href='#' onClick={handleUploadAll} className=" text-red-300"> Retry </a></>) : " " )) }</p>
              </li>
              <li class="mb-10 ml-6">
                { status === ST_CREATING_SUCCESS ? 
                      <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                          <svg class="w-3.5 h-3.5 text-green-500 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                          </svg>
                      </span> : 
                  (status == ST_CREATING_FAILED ? 
                    <span class="absolute flex items-center justify-center w-8 h-8 bg-red-400 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-red-700">
                      <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                          <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"/>
                      </svg>
                    </span>
                    :<span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                          {
                            (status === ST_CREATING_COLLECTION ?
                              <svg aria-hidden="true" class="inline p-1 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                              </svg> :
                              <svg class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                                <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z"/>
                              </svg>)
                          }
                      </span>
                  )
                }
                  <h3 class="font-medium leading-tight">Create Collection</h3>
                  <div class="text-sm">{ status === ST_CREATING_COLLECTION ? "Creating ..." 
                    : ( status === ST_CREATING_FAILED ? ( <>Failed <a href='#' onClick={createCollection} className=" text-red-300"> Retry </a></>) : "") }</div>
              </li>
            </ol>
          </div>
          <div className="w-6/12 flex justify-center">
            <span className="text-center text-lg"> Don't close this Dialogue or Website while creating NFT collection.</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTrigger = () => {
    return null;
  };

  return (
    <NcModal
      isOpenProp={show}
      onCloseModal={onCloseModal}
      contentExtraClass="max-w-screen-sm"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle="Create Collection"
    />
  );
};

export default UploadItems;
