// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Token {
    // Token details
    string public name = "My Hardhat Token";
    string public symbol = "MHT";
    uint256 public totalSupply = 1000000;
    address public owner;

    // Account balances
    mapping(address => uint256) balances;

    // Deposit tracking
    struct Deposit {
        uint256 amount;
        uint256 timestamp;
    }
    mapping(address => Deposit) public deposits;

    // Events
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event DepositMade(address indexed _depositor, uint256 _amount);
    event Withdrawal(address indexed _depositor, uint256 _amount, uint256 _interest);

    /**
     * Contract initialization.
     */
    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * Transfer tokens function.
     */
    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    /**
     * Check balance function.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    /**
     * Deposit tokens for interest.
     */
    function deposit(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens for deposit");

        balances[msg.sender] -= amount;
        deposits[msg.sender] = Deposit({
            amount: amount,
            timestamp: block.timestamp
        });

        emit DepositMade(msg.sender, amount);
    }

    /**
     * Withdraw tokens with interest.
     */
    function withdraw() external {
        Deposit memory userDeposit = deposits[msg.sender];
        require(userDeposit.amount > 0, "No active deposit");

        // Calculate interest based on time passed since deposit
        uint256 timePassed = (block.timestamp - userDeposit.timestamp) / 5 minutes;
        uint256 interest = (userDeposit.amount * 2 / 100) * timePassed;

        // Transfer principal + interest back to the user
        uint256 totalAmount = userDeposit.amount + interest;
        balances[msg.sender] += totalAmount;

        // Clear the deposit record
        delete deposits[msg.sender];

        emit Withdrawal(msg.sender, userDeposit.amount, interest);
    }
}
