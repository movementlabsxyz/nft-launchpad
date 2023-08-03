import { useState, useEffect, useMemo } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { AptosDecimalToNoDecimal, StateInfo, getCollectionAddress, w3_changeAdmin, w3_changeTaxRate, w3_getState, w3_withdrawEarning, w3_withdrawTax } from "../utils/web3";
import Button from "./Button";
import { toast } from "react-toastify";
import { getCollectionsApi } from "../api";
import EarningWithdrawDialog from "./EarningWithdrawDialog";

export default function AdminPage() {
  const wallet = useWallet();
  const [verified, setVerified] = useState(true);

  const [stateData, setStateData] = useState<StateInfo | null>(null);
  const [updateFlag, toggleFlag] = useState(false);

  const [adminAddress, setAdminAddress] = useState("");
  const [taxRate, setTaxRate] = useState(0);

  const [collections, setCollections] = useState([]);

  // earning
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawCollection, setWithdrawCollection] = useState("");


  useEffect(() => {
    w3_getState().then((data) => {
      setStateData(data);
      console.log("data =", data);
    })
  }, [updateFlag]);

  useEffect(() => {
    if (stateData) {
      setAdminAddress(stateData?.admin_address);
      setTaxRate(Number(stateData?.platform_tax_rate ?? 0) / 10);

      getCollectionsApi().then(data => {
        let collections: any = [];
        data.forEach((d: any) => {
          let cAddy = getCollectionAddress(d.name);
          let collectionOnChain = stateData.collections.data.find((v) => v.key === cAddy);
          if (collectionOnChain)
            collections.push({ ...d, ...collectionOnChain });
        })
        setCollections(collections);
      })
    }
  }, [stateData])

  const taxValue = useMemo(() => (Number(stateData?.tax_coins.value ?? 0) / Math.pow(10, 8)).toFixed(3), [stateData])

  const changeAdmin = () => {
    if (!wallet?.account?.address || !stateData) {
      console.log("wallet error");
      return;
    }
    w3_changeAdmin({
        admin_address: adminAddress,
        trigger_address: stateData?.trigger_address
      }, wallet
    ).then(() => {
      toast.success("Admin has changed Successfully!");
    })
    .catch(() => {
      toast.error("Admin changing failed");
    })
  }

  const changeTaxRate = () => {
    if (!wallet?.account?.address || !stateData) {
      console.log("wallet error");
      return;
    }
    w3_changeTaxRate({
        taxRate: taxRate * 10
      }, wallet
    ).then(() => {
      toast.success("Admin has changed Successfully!");
    })
    .catch(() => {
      toast.error("Admin changing failed");
    })
  }

  const withdrawTax = () => {
    if (!wallet?.account?.address || !stateData) {
      console.log("wallet error");
      return;
    }

    w3_withdrawTax(wallet).then(() => {
      toast.success("Tax withdrawn Successfully!");
    })
    .catch(() => {
      toast.error("Withdrawing failed");
    })
  }

  
  const withdrawEarning = (receiverAddy: string) => {
    if (!wallet?.account?.address || !stateData) {
      console.log("wallet error");
      return;
    }
    w3_withdrawEarning({
        collection_name: withdrawCollection,
        receiver: receiverAddy
      }, wallet
    ).then(() => {
      toast.success("Withdrawn Successfully!");
      toggleFlag(!updateFlag);
    })
    .catch(() => {
      toast.error("Withdrawing failed");
    })
  }
  

  return (
    <div className="flex flex-col">
      <div>
        <div className="flex-col p-3 bg-amber-100 dark:bg-gray-600">  
          <span className="w-3/12 mb-2 text-amber-950 text-lg px-1 dark:text-gray-300"> Current Admin: </span>
          <div className="flex mt-1 justify-between">
            <input type="text" className="w-8/12 border-gray-200 border-2 p-1 mr-3 dark:border-gray-600 dark:bg-gray-500 dark:text-gray-200"
              value={adminAddress} 
              onChange={(e) => setAdminAddress(e.target.value)}
            />
            <Button 
              className=" mt-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              onClick={() => changeAdmin()}
            >
              Change
            </Button>
          </div>
          
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex p-3 bg-amber-100 mt-3 justify-between dark:bg-gray-600">
          <div className="flex w-full ">    
            <span className="w-5/12 p-3 mb-2 text-amber-950 text-lg px-1 dark:text-gray-300"> Current Tax Rate: </span>
            <input type="text" className="w-4/12 border-gray-200 border-2 p-1 mr-3 text-right dark:border-gray-600 dark:bg-gray-500 dark:text-gray-200"
              value={taxRate} 
              onChange={(e) => setTaxRate(Number(e.target.value))}
            />
            <span className="py-4 dark:text-gray-300">%</span>
          </div>
          <Button 
            className=" mt-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => changeTaxRate()}
          >
            Change
          </Button>
        </div>
        <div className="flex p-3 bg-amber-100 mt-3 justify-between dark:bg-gray-600">  
          <span className="text-xl px-1 py-3 dark:text-gray-300"> Tax Taken: {taxValue} APT</span>
          <Button 
            className=" text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => withdrawTax()}
          >
            Withdraw Tax
          </Button>
        </div>
      </div>
      
      <div className="flex-col p-3 bg-amber-100 mt-3 justify-between dark:bg-gray-600">
        <span className="px-1 mb-3 text-lg dark:text-gray-300">Earned per collection</span>
        <table className="w-full mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                      No
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Collection
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Creator
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Earning
                  </th>
                  <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Withdraw</span>
                  </th>
                </tr>
            </thead>
            <tbody>
              {
                collections ? collections.map((col: any, index) => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      {index + 1}
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {col.name}
                    </th>
                    <td className="px-6 py-4">
                      {col.creator_email}
                    </td>
                    <td className="px-6 py-4">
                      {AptosDecimalToNoDecimal(col?.value?.earned_coins?.value)}
                    </td>
                    <td className="px-6 py-1 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() => {
                            setShowWithdrawModal(true);
                            setWithdrawCollection(col.name); 
                          }}
                        >Withdraw</a>
                    </td>
                  </tr>
                )) : <tr><td> No Collections yet </td></tr>
              }
              
            </tbody>
          </table>
      </div>
      <EarningWithdrawDialog
        show={showWithdrawModal}
        onCloseModal={() => setShowWithdrawModal(false)}
        onOk={(walletAddy: string) => withdrawEarning(walletAddy)}
        collectionName={withdrawCollection}
      />
    </div>
        
  )
}
