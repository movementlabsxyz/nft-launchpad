import { useState, useEffect } from "react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import WalletSelectorAntDesign from "../components/WalletSelectorAntDesign"
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { useWallet } from "@aptos-labs/wallet-adapter-react"
import AdminUserManagement from "../components/AdminUserManagement"
import AdminSettings from "../components/AdminSettings"
import { getNonce, verifyAdmin } from "../api"
import { stringToHex } from "../utils/web3"

export default function ProtectedPage() {
  const wallet = useWallet();
  const [verified, setVerified] = useState(true);
  const [mode, setMode] = useState(0);  
  const [adminJwt, setAdminJwt] = useState(null);

  // when window is ready
  useEffect(() => {
    let item = localStorage.getItem("admin-jwt");
    item && setAdminJwt(item as any);
  }, [])

  const verifyWallet = async () => {
    if (!wallet.account) return;
    let nonce = await getNonce(wallet.account?.address);
    let message = `This is for signing message`
    let body = await wallet.signMessage({
      message,
      nonce
    });
    console.log("sign body =", body);

    if (body) {
      if ("success" in body) { // for pontem wallet
        if (!body.success) return;
        body = (body as any).result;
      }
      let jwt = await verifyAdmin(body!.fullMessage, body!.signature as string, wallet.account.address, wallet.account.publicKey as string);
      
      // add jwt to session storage
      localStorage.setItem("admin-jwt", jwt);
      setAdminJwt(jwt);
    }
  }

  useEffect(() => {
    setAdminJwt(null);
    if (wallet.account) {
      verifyWallet()
    }
  }, [wallet?.account?.address])

  // If no session exists, display access denied message
  if (!adminJwt) {
    return (
      
        <div className="w-full flex justify-between dark:text-gray-200">
          <div></div>
          <div className="flex flex-col">
            <span className="text-2xl py-1 pt-4">Access Denied</span>
            <span>Sigin in with your wallet</span>
          </div>
          <div className="float-right py-3">
            <WalletSelectorAntDesign/>
          </div>
        </div>
    )
  }

  // If session exists, display content
  return (
      <div className="flex flex-col">
        <div className="flex w-full justify-between mb-3">
          <div className="w-4/12 bg-white border-t border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-2 mx-auto font-medium">
                <button type="button" 
                  className={ (!mode?"bg-blue-200 ":"") + "inline-flex flex-col items-center justify-center px-5 border-gray-200 border-x hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600"}
                  onClick={() => setMode(0)}
                >
                    <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Users</span>
                </button>
                <button type="button" 
                  className={ (mode?"bg-blue-200 ":"") + "py-3 inline-flex flex-col items-center justify-center px-5 border-r border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600"}
                  onClick={() => setMode(1)}
                >
                  <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/>
                  </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Settings</span>
                </button>
            </div>
          </div>
          <div className="py-3">
            <WalletSelectorAntDesign/>
          </div>

        </div>

        <div className={ mode ? "hidden" : "" }>
          <AdminUserManagement/>
        </div>
        <div className={ !mode ? "hidden" : "" }>
          <AdminSettings/>
        </div>
        
      </div>
  )
}
