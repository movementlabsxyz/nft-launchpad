import { useState, useEffect } from "react";
import NcModal from "./NcModal";
import Button from "./Button";

const EarningWithdrawDialog = ({
  show,
  onOk,
  onCloseModal,
  collectionName
}: any) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [statusText, setStatusText] = useState("");

  const onConfirm = () => {
    if (walletAddress.trim() === "") {
      setStatusText("Please input wallet address. Admin should have wallet address.");
      return;
    }
    setStatusText("");
    onOk(walletAddress);
  }

  const renderContent = () => (
    <div className="flex w-full h-full bg-white dark:bg-transparent">
      <div className="p-5 w-full">
        <div className="flex mb-2 px-1">  
          <span className="text-lg text-blue-600">Collection Name: </span>
          <span className="px-5 text-xl text-red-950 dark:text-gray-300">{collectionName}</span>
        </div>
        <div className="flex mb-2">  
          <span className=" w-full p-1">Collection Creator Wallet :</span>
          <input type="text" className=" w-full border-gray-200 border-2 p-1 dark:border-gray-600 dark:bg-gray-500 dark:text-gray-200"
            value={walletAddress} 
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>
        <div>
          <span className="text-red-500"> {statusText} </span>
        </div>
        <div>
          <Button 
            className="float-right mt-3 text-white bg-gradient-to-r from-blue-500 to-dark-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => onCloseModal()}
          >
            Close  
          </Button>
          <Button 
            className="float-right mt-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => onConfirm()}
          >
            Confirm
          </Button>
        </div>
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
      contentExtraClass="max-w-screen-sm"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle={"Withdraw Earnings"}
    />
  );
};

export default EarningWithdrawDialog;
