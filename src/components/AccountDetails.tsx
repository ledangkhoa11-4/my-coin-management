import React, { useState, useEffect } from "react";
import { Account } from "../interfaces/Account";
import { ethers } from "ethers";
import { sendToken } from "../wallet-utils/TransactionUtils";
import Loading from "./Loading";
import numeral from "numeral";
import { toast } from "react-toastify";

interface AccountDetailProps {
  account: Account;
  onTransactionComplete: () => void;
}

const AccountDetails: React.FC<AccountDetailProps> = ({ account, onTransactionComplete }) => {
  const [destinationAddress, setDestinationAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(account.balance);
  const [networkResponse, setNetworkResponse] = useState<{
    status: null | "pending" | "complete" | "error";
    message: string | React.ReactElement;
  }>({
    status: null,
    message: "",
  });

  function formatEthFunc(value: string, decimalPlaces: number = 2) {
    return +parseFloat(value).toFixed(decimalPlaces);
  }

  useEffect(() => {
    const fetchData = () => {
      const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/8d63ee9794ef47a1912ffcdde107e97e");
      const tokenAddress = "0x98F17bfB88A9C7876C0249211010DcE2cFcB67CF";
      const abi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];
      const contract = new ethers.Contract(tokenAddress, abi, provider);
      setLoading(true);
      contract.balanceOf(account.address).then((balance: ethers.BigNumberish) => {
        setBalance(
          String(formatEthFunc(ethers.utils.formatEther(balance)))
          // String(accountBalance)
        );
        setLoading(false);
      });
    };

    fetchData();
  }, [account]);

  const handleDestinationAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestinationAddress(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number.parseFloat(e.target.value));
  };

  const notify = () => toast("Transfer failure");

  const transfer = async () => {
    setNetworkResponse({
      status: "pending",
      message: "",
    });
    try {
      const { transaction, receipt } = await sendToken(amount, account.address, destinationAddress, account.privateKey);
      console.log(transaction, receipt);
      if (receipt.status === 1) {
        setNetworkResponse({
          status: "complete",
          message: (
            <span>
              Transfer complete!{" "}
              <a target="_blank" rel="noreferrer" href="https://sepolia.etherscan.io/token/0x98f17bfb88a9c7876c0249211010dce2cfcb67cf">
                See full information here!
              </a>
            </span>
          ),
        });
        onTransactionComplete();
        return receipt;
      } else {
        console.log(`Failed to send ${receipt}`);
        notify();
        setNetworkResponse({
          status: "error",
          message: JSON.stringify(receipt),
        });
        return { receipt };
      }
    } catch (error: any) {
      console.error(error);
      notify();
      setNetworkResponse({
        status: "error",
        message: error.reason || JSON.stringify(error),
      });
    }
  };

  return (
    <div className="">
      {loading || networkResponse.status === "pending" ? <Loading /> : null}
      <div>
        <span className="text-gray-900 font-medium">Balance: </span>
        {!loading ? `${numeral(balance).format("0,0[.]00")} KDC` : null}
      </div>

      <div className="my-2">
        <label htmlFor="" className="mr-2 text-gray-900 font-medium">
          Destination Address:
        </label>
        <input
          type="text"
          required
          value={destinationAddress}
          onChange={handleDestinationAddressChange}
          className="border outline-none rounded-lg py-1 px-3 text-sm"
        />
      </div>

      <div>
        <label htmlFor="" className="mr-2 text-gray-900 font-medium">
          Amount:
        </label>
        <input
          type="number"
          required
          min={0}
          value={amount}
          onChange={handleAmountChange}
          className="border outline-none rounded-lg py-1 px-3 text-sm"
        />
      </div>

      <button
        className="text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 m-2"
        type="button"
        onClick={transfer}
        disabled={!destinationAddress || !amount || networkResponse.status === "pending"}
      >
        Send {amount} KDC
      </button>

      {networkResponse.status && (
        <>
          {networkResponse.status === "pending" && <p>Transfer is pending...</p>}
          {networkResponse.status === "complete" && <div>{networkResponse.message}</div>}
          {networkResponse.status === "error" && <p>Error occurred while transferring tokens: {networkResponse.message}</p>}
        </>
      )}
    </div>
  );
};

export default AccountDetails;
