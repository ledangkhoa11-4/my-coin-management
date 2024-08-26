import React, { useEffect, useState } from "react";
import axios from "axios";
import numeral from "numeral";
import { ethers } from "ethers";
import { Account } from "./AccountCreate";

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: number;
}

interface TransactionTableProps {
  account: Account;
}

const TransactionDetails: React.FC<TransactionTableProps> = ({ account }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const url = `https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=0x98F17bfB88A9C7876C0249211010DcE2cFcB67CF&address=${account.address}&page=1&offset=100&sort=asc&apikey=4PJYVRNIJJN5Q2Y2DWWF49TCPAUGGYM6XX`;

      try {
        const response = await axios.get(url);
        const transactionData: Transaction[] = response.data.result;
        setTransactions(transactionData);
        console.log(transactionData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [account]);

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4">No.</th>
          <th className="py-2 px-4">Hash</th>
          <th className="py-2 px-4">From</th>
          <th className="py-2 px-4">To</th>
          <th className="py-2 px-4">Value</th>
          <th className="py-2 px-4">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => {
          const date = new Date(transaction.timeStamp * 1000).toLocaleDateString("en-US");
          return (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{`${transaction.hash.slice(0, 5)}...${transaction.hash.slice(-3)}`}</td>
              <td className="py-2 px-4">{`${transaction.from.slice(0, 5)}...${transaction.from.slice(-3)}`}</td>
              <td className="py-2 px-4">{`${transaction.to.slice(0, 5)}...${transaction.to.slice(-3)}`}</td>
              <td className="py-2 px-4">{numeral(ethers.utils.formatEther(transaction.value)).format("0,0[.]00")} KDC</td>
              <td className="py-2 px-4">{date}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TransactionDetails;
