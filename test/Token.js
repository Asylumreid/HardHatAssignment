const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const hardhatToken = await ethers.deployContract("Token");
    await hardhatToken.waitForDeployment();
    return { hardhatToken, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
      await expect(hardhatToken.transfer(addr1.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
        .to.emit(hardhatToken, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture);
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      await expect(hardhatToken.connect(addr1).transfer(owner.address, 1))
        .to.be.revertedWith("Not enough tokens");

      expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Deposits and Withdrawals", function () {
    it("Should allow owner to deposit tokens", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const depositAmount = 100;

      await expect(hardhatToken.deposit(depositAmount))
        .to.emit(hardhatToken, "DepositMade")
        .withArgs(owner.address, depositAmount);

      const depositInfo = await hardhatToken.deposits(owner.address);
      expect(depositInfo.amount).to.equal(depositAmount);
      expect(depositInfo.timestamp).to.be.a("bigint"); // Check if it's a BigInt, suitable for Solidity timestamp
    });

    it("Should allow user to withdraw with interest after some time", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const depositAmount = BigInt(100); // Explicitly convert deposit amount to BigInt
    
      await hardhatToken.deposit(depositAmount);
    
      // Simulate time passing by increasing the timestamp
      await network.provider.send("evm_increaseTime", [300]); // 5 minutes
      await network.provider.send("evm_mine");
    
      const initialBalance = BigInt(await hardhatToken.balanceOf(owner.address)); // Convert balance to BigInt
    
      await expect(hardhatToken.withdraw())
        .to.emit(hardhatToken, "Withdrawal")
        .withArgs(owner.address, depositAmount, BigInt(2)); // Expect 2% interest after 5 minutes
    
      const finalBalance = BigInt(await hardhatToken.balanceOf(owner.address)); // Convert final balance to BigInt
      expect(finalBalance).to.equal(initialBalance + depositAmount + BigInt(2)); // Use BigInt addition
    });

    it("Should fail if a non-depositor tries to withdraw", async function () {
      const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture);
      await expect(hardhatToken.connect(addr1).withdraw()).to.be.revertedWith("No active deposit");
    });

    it("Should handle multiple deposit and withdrawal cycles correctly", async function () {
      const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
      const depositAmount = 100;

      await hardhatToken.deposit(depositAmount);

      await network.provider.send("evm_increaseTime", [300]); // 5 minutes
      await network.provider.send("evm_mine");

      await hardhatToken.withdraw();

      const firstWithdrawBalance = await hardhatToken.balanceOf(owner.address);

      await hardhatToken.deposit(depositAmount);
      await network.provider.send("evm_increaseTime", [600]); // 10 minutes
      await network.provider.send("evm_mine");

      await hardhatToken.withdraw();

      const secondWithdrawBalance = await hardhatToken.balanceOf(owner.address);
      expect(secondWithdrawBalance).to.be.above(firstWithdrawBalance);
    });
  });
});
