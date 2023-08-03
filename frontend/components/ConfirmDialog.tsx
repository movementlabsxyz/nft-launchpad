import { useState, useEffect } from "react";
import NcModal from "./NcModal";
import Button from "./Button";

const ConfirmDialog = ({
  title,
  show,
  onOk,
  onCloseModal,
}: any) => {
  const renderContent = () => (
    <div className="flex w-full h-full bg-white dark:bg-transparent">
      <Button 
        className="w-full text-white bg-gradient-to-r from-yellow-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={() => onOk()}
      >
        Ok
      </Button>
      <Button 
        className="w-full text-white bg-gradient-to-r from-blue-500 to-dark-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={() => onCloseModal()}
      >
        Close  
      </Button>
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
      modalTitle={title}
    />
  );
};

export default ConfirmDialog;
