import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import { SocialConnect } from "../components/social-connect"
import WalletSelectorAntDesign from "../components/WalletSelectorAntDesign"
import { getAllUsersApi, removeUserApi } from "../api"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import AddUserModal from "../components/AddUserModal"
import Button from "../components/Button"
import ConfirmDialog from "../components/ConfirmDialog"
import { toast } from "react-toastify"

export default function ProtectedPage() {
  const wallet = useWallet();
  const [allUsers, setAllUsers] = useState([])
  const [verified, setVerified] = useState(true);
  const [updateFlag, toggleFlag] = useState(false);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userModalProps, setUserModalProps] = useState(undefined);
  const [showRmUserModal, setShowRmUserModal] = useState(false);
  const [removeUserId, setRemoveUserId] = useState(0);

  // Fetch content from protected route
  useEffect(() => {
    if (verified) {
      getAllUsersApi().then((data) => {
        setAllUsers(data);
      });
    }
  }, [wallet, verified, updateFlag])

  const onSuccess = () => {
    toggleFlag(!updateFlag);
    setShowAddUserModal(false);
  }

  const showUserModal = (props?: any) => {
    // true: create false: edit
    setUserModalProps(props)
    setShowAddUserModal(true);
  }

  const removeUser = () => {
    removeUserApi(removeUserId).then((res: any) => {
      if (res) {
        toast.success(`Removed User successfully.`);
        toggleFlag(!updateFlag);
      } else {
        toast.error('Removing User Failed');
      }
    })
    .catch(() => {
      toast.error('Removing User Failed');
    })
    setShowRmUserModal(false)
  }

  // If session exists, display content
  return (
      <div className="flex flex-col">
        <div className="flex w-full justify-end mb-3">
          <div className="flex w-full justify-start">
            <Button 
              className="float-right mt-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={() => showUserModal()}
            >
              + Add User
            </Button>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                      No
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Wallet
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Edit</span>
                  </th>
                  <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Remove</span>
                  </th>
                </tr>
            </thead>
            <tbody>
              {
                allUsers ? allUsers.map((user: any, index) => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      {index + 1}
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {user.name}
                    </th>
                    <td className="px-6 py-4">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {user.wallet}
                    </td>
                    <td className="px-6 py-4">
                      {user.role ? "Admin" : "Creator"}
                    </td>
                    <td className="px-1 py-1 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                           onClick={() => showUserModal(user)}
                        >Edit</a>
                    </td>
                    <td className="px-1 py-4 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() => { setShowRmUserModal(true); setRemoveUserId(user.id) }}
                        >Remove</a>
                    </td>
                  </tr>
                )) : <tr><td> No Users </td></tr>
              }
              
            </tbody>
          </table>
        </div>
        <AddUserModal
          userData={userModalProps}
          show={showAddUserModal}
          onCloseModal={() => setShowAddUserModal(false)}
          onOk={() => onSuccess()}
        />
        <ConfirmDialog
          title={"Confirm User Removal"}
          show={showRmUserModal}
          onOk={removeUser}
          onClose={() => setShowRmUserModal(false)}
        />
      </div>
  )
}
