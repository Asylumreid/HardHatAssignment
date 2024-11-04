Here’s the README in Markdown format:

---

# Assignment

Project encompasses Task 1 and Task 2 on local network.

Things to work on:

- Function modifier (ownerOnly and etc)
- Able to deploy on sepolia

## Features

- **Token Transfer**: Users can transfer tokens between accounts.
- **Deposits**: Token holders can deposit tokens to earn interest.
- **Withdrawals**: Depositors can withdraw their deposited tokens along with interest.

The interest rate is set at **2% per 5-minute block**.

## Requirements

- [Node.js](https://nodejs.org/) (v14 or above)
- [Hardhat](https://hardhat.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

### 1. Clone the Repository

```bash
git clone 
cd 
```

### 2. Install Dependencies

```bash
npm install
cp .env
```

### 3. Compile the Contract

To compile the Solidity contract, run:

```bash
npx hardhat compile
```

### 4. Deploy the Contract

To deploy the contract on the Hardhat local network, use:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Alternatively, specify another network in the `hardhat.config.js` file.

### 5. Run Tests

Run the test suite to verify the contract functionality:

```bash
npx hardhat test
```

### 6. Deploy on Local

Run the test suite to verify the contract functionality:

```bash
npx hardhat run scripts/deploy.js --network hardhat
```

## Project Structure

- `contracts/Token.sol`: The main token contract that includes functions for transferring, depositing, and withdrawing tokens.
- `scripts/deploy.js`: Deployment script for deploying the contract on a network.
- `test/Token.js`: Contains Mocha and Chai tests for all contract functions, including deposits and withdrawals.

## Contract Details

### Functions

- **constructor**: Initializes the contract, assigns the total supply to the deployer, and sets the owner.

- **transfer(address to, uint256 amount)**: Allows a token transfer from the sender to another address.

- **deposit(uint256 amount)**: Allows the token owner to deposit tokens for interest. The interest rate is calculated at 2% per 5 minutes.

- **withdraw()**: Allows the depositor to withdraw the initial deposit plus accumulated interest. Only the original depositor can withdraw their tokens.

### Events

- `Transfer`: Emitted whenever tokens are transferred between accounts.
- `DepositMade`: Emitted when a user makes a deposit.
- `Withdrawal`: Emitted when a user withdraws their deposit with interest.

## Testing

The project includes tests for:

1. **Deployment**:
   - Checks if the owner is correctly assigned.
   - Verifies if the total supply is allocated to the owner.

2. **Transactions**:
   - Validates token transfers between accounts.
   - Ensures transfer events are emitted correctly.
   - Confirms transfers fail if the sender has insufficient tokens.

3. **Deposits and Withdrawals**:
   - Verifies deposits update balances correctly and emit `DepositMade`.
   - Confirms withdrawals calculate interest properly and emit `Withdrawal`.
   - Ensures unauthorized accounts cannot withdraw.

Run all tests with:

```bash
npx hardhat test
```

## License

This project is licensed under the MIT License.

---

This Markdown README provides a comprehensive overview of your Hardhat project, covering setup, functionality, and testing procedures. Let me know if there’s anything specific you’d like to add or modify!
