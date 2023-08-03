import { useState, useEffect } from "react";
import NcModal from "./NcModal";
import Button from "./Button";
import { addUserApi, updateUserApi } from "../api";
import { toast } from "react-toastify";

const AddUserModal = ({
  userData,
  show,
  onOk,
  onCloseModal,
  details
}: any) => {
  const [name, setName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(0);

  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (userData) {
      setName(userData.name)
      setWalletAddress(userData.wallet)
      setEmail(userData.email)
      setRole(userData.role)
    } else {
      setName("");
      setWalletAddress("");
      setEmail("");
      setRole(0)
      setStatusText("")
    }
  }, [userData]);
  
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const onConfirm = () => {
    if (name.trim() === "") {
      setStatusText("Please input correct name!");
      return;
    }
    if (role === 0 && !validateEmail(email)) {
      setStatusText("Please input correct email address. Creator should have an email address.");
      return;
    }
    if (role === 1 && walletAddress.trim() === "") {
      setStatusText("Please input wallet address. Admin should have wallet address.");
      return;
    }
    setStatusText("");
    if (userData) {
      updateUserApi(
        userData.id,
        name.trim(),
        email.trim(),
        walletAddress.trim(),
        role
      ).then((res: any) => {
        if (res) {
          toast.success(`Updated ${name} User successfully.`);
          onOk()
        } else {
          toast.error('Updating User Failed');
        }
      })
    } else {
      addUserApi(
        name.trim(),
        email.trim(),
        walletAddress.trim(),
        role
      ).then((res: any) => {
        if (res) {
          toast.success(`Added ${name} User successfully.`);
          onOk()
        } else {
          toast.error('Adding User Failed');
        }
      })
    }
  }

  const renderContent = () => (
    <div className="flex w-full h-full bg-white dark:bg-transparent">
      <div className="p-5 w-full">
        <div className="flex mb-2">  
          <span className=" w-full p-1">User Name(*) :</span>
          <input type="text" className=" w-full border-gray-200 border-2 p-1 dark:text-gray-700"
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex mb-2">  
          <span className=" w-full p-1">User Email :</span>
          <input type="text" className=" w-full border-gray-200 border-2 p-1 dark:text-gray-700"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex mb-2">  
          <span className=" w-full p-1">User Wallet :</span>
          <input type="text" className=" w-full border-gray-200 border-2 p-1 dark:text-gray-700"
            value={walletAddress} 
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>
        <div className="flex mb-2">  
          <span className=" w-full p-1">User Role:</span>
          <select id="roles" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={role}
            onChange={(e) => setRole(parseInt(e.target.value))}
          >
            <option value="0">Creator</option>
            <option value="1">Admin</option>
            <option value="2" disabled>Super Admin</option>
          </select>
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
      modalTitle={userData ? "Edit User" : "Add User"}
    />
  );
};

export default AddUserModal;
