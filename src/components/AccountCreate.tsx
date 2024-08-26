import React, { useState } from "react";
import { generateAccount } from "../wallet-utils/AccountUtils";
import AccountDetails from "./AccountDetails";
import TransactionDetails from "./TransactionDetails";
import Loading from "./Loading";
import { toast } from "react-toastify";

export interface Account {
  privateKey: string;
  address: string;
  balance: string;
}

const AccountCreate: React.FC = () => {
  const [showInput, setShowInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [account, setAccount] = useState<Account | null>(null);

  const createAccount = async () => {
    setLoading(true);
    const account = await generateAccount();
    console.log("Account created!", account);
    setSeedPhrase(account.seedPhrase);
    setAccount(account.account);
    setShowInput(false);
    setLoading(false);
  };

  const showInputFunction = () => {
    setShowInput(true);
    setAccount(null);
  };

  const handleSeedPhraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeedPhrase(e.target.value);
  };

  const notify = () => toast("Seed phrase is not correct or invalid");

  const handleSeedPhraseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const account = await generateAccount(seedPhrase);
      console.log(account);
      setSeedPhrase(account.seedPhrase);
      setAccount(account.account);
    } catch (e) {
      console.log(e);
      notify();
      setShowInput(true);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionCompleted = () => {
    if (account) {
      setAccount({...account});
    }
  };

  return (
    <div className="w-full mx-3 bg-white rounded-md shadow-md p-6">
      {loading ? <Loading /> : null}
      <h2 className="text-center text-2xl font-bold mb-4">Khoa Diamond Coin Management</h2>
      <div className="flex items-center justify-center">
      <button
        onClick={createAccount}
        className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      >
        Create Account
      </button>
      <button
        onClick={showInputFunction}
        className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      >
        Access wallet by seed phrase
      </button>

      </div>
      {showInput && (
        <form onSubmit={handleSeedPhraseSubmit} className="flex m-2">
          <input
            type="text"
            required
            value={seedPhrase}
            onChange={handleSeedPhraseChange}
            className="bg-transparent border border-gray-300 rounded-md w-full py-2 px-4 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mr-2"
            placeholder="Enter your text"
          />
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 m-2"
          >
            Submit
          </button>
        </form>
      )}

      {account?.address ? (
        <div className="mt-3">
          <p className=" text-gray-900 font-medium">A/C Address: </p>
          <span className="text-gray-600 mt-2">{account?.address}</span>
        </div>
      ) : null}

      {account && seedPhrase ? (
        <div className="mt-3">
          <p className="text-gray-900  font-medium">Your Seed Phrase: </p>
          <span className="text-gray-600 text-normal">{seedPhrase}</span>
        </div>
      ) : null}

      {account && <hr className="my-3" />}
      {account && <AccountDetails account={account} onTransactionComplete={handleTransactionCompleted} />}
      {account && <TransactionDetails account={account} />}
    </div>
  );
};

export default AccountCreate;

//text-gray-600 mt-2
