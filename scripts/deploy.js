const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // Deploy the contract
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();  // Remove `.deployed()` here
  console.log(`Token contract deployed to: ${token.address}`);

  // Get accounts
  const [deployer, secondAccount] = await ethers.getSigners();

  // Transfer 1000 tokens to the second account
  console.log("Transferring 1000 tokens to the second account...");
  await token.transfer(secondAccount.address, 1000);
  console.log(`Balance of second account: ${await token.balanceOf(secondAccount.address)}`);

  // Deposit 500 tokens from the second account (if implemented)
  console.log("Depositing 500 tokens from the second account...");
  await token.connect(secondAccount).deposit(500);
  console.log(`Second account deposited 500 tokens`);

  // Wait 5 minutes for interest accrual
  console.log("Waiting 5 minutes...");
  await hre.network.provider.send("evm_increaseTime", [300]);
  await hre.network.provider.send("evm_mine");

  // Withdraw 500 tokens to the second account (if implemented)
  console.log("Withdrawing tokens back to second account with interest...");
  await token.connect(secondAccount).withdraw();
  console.log(`New balance of second account after withdrawal: ${await token.balanceOf(secondAccount.address)}`);

  // Deploy to Sepolia network
  console.log("Deploying to Sepolia network...");
  const tokenOnSepolia = await Token.deploy();
  console.log(`Token deployed to Sepolia network at address: ${tokenOnSepolia.address}`);
}

// Run the main function and catch errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
