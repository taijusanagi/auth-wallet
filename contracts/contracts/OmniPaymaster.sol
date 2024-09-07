// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OmniPaymaster {
    address public omniExecutor;

    mapping(address => uint256) public balances;

    function addBalance(address _user) public payable {
        balances[_user] += msg.value;
    }
}
