import { ethers, Wallet } from "ethers";

const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/8d63ee9794ef47a1912ffcdde107e97e");
const tokenAddress = "0x98F17bfB88A9C7876C0249211010DcE2cFcB67CF";
const abi = ["function transfer(address to, uint256 amount) returns (bool)", "function decimals() view returns (uint8)"];
const contract = new ethers.Contract(tokenAddress, abi, provider);

export async function sendToken(amount: number, from: string, to: string, privateKey: string) {
  const wallet: Wallet = new ethers.Wallet(privateKey, provider);

  try {
    const contractWithSigner = contract.connect(wallet);

    const decimals = await contract.decimals();

    const amountInWei = ethers.utils.parseUnits(amount.toString(), decimals);

    const transaction = await contractWithSigner.transfer(to, amountInWei);

    const receipt = await transaction.wait();

    return { transaction, receipt };
  } catch (error) {
    console.error("Error during transfer:", error);
    return { transaction: error, receipt: error };
  }
}
