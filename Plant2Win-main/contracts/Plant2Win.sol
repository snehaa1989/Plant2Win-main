// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Plant2Win {
    address payable public owner;
    mapping(address => uint256) public balances;
    uint256 public totalEthHolding;
    uint256 public rewardRate;
    address[] private users;

    constructor() {
        owner = payable(msg.sender);
        rewardRate = 8;
    }

    function deposit() external payable {
        require(msg.value > 0, "Amount must be greater than zero");
        balances[msg.sender] += msg.value;
        totalEthHolding += msg.value;

        // Add the user to the list if not already present
        if (balances[msg.sender] == msg.value) {
            users.push(msg.sender);
        }
    }

    function withdrawal(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        totalEthHolding -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getEthHolding() external view returns (uint256) {
        return totalEthHolding;
    }

    function reward() external view returns (uint256) {
        return (totalEthHolding * rewardRate) / 100;
    }

    function sendEtherToUsers() external {
        require(msg.sender == owner, "Only the contract owner can execute this function");

        for (uint256 i = 0; i < users.length; i++) {
            address user = users[i];
            uint256 balance = balances[user];
            if (balance > 0) {
                balances[user] = 0;
                totalEthHolding -= balance;
                payable(user).transfer(balance);
            }
        }

        // Clear the list of user addresses
        delete users;
    }

    function getRandomAddresses() external view returns (address[] memory) {
    require(users.length >= 5, "Not enough users");

    address[] memory randomAddresses = new address[](5);

    for (uint256 i = 0; i < 5; i++) {
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, i, msg.sender))) % users.length;
        randomAddresses[i] = users[randomIndex];
    }

    return randomAddresses;
}
}
