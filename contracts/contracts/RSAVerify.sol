// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract JWTRSAVerification {
    function verify(
        bytes32 _message,
        bytes memory _signature,
        bytes memory _exponent,
        bytes memory _modulus
    ) public view returns (bool) {
        bytes memory input = abi.encodePacked(
            uint256(_signature.length),
            uint256(_exponent.length),
            uint256(_modulus.length),
            _signature,
            _exponent,
            _modulus
        );

        (bool success, bytes memory result) = address(0x05).staticcall(input);
        require(success, "Modular exponentiation failed");

        if (result.length < 11 || result[0] != 0x00 || result[1] != 0x01) {
            console.log("Invalid padding start");
            return false;
        }

        uint256 paddingEnd = 2;
        while (paddingEnd < result.length && result[paddingEnd] == 0xFF) {
            paddingEnd++;
        }

        if (paddingEnd + 1 >= result.length || result[paddingEnd] != 0x00) {
            console.log("Invalid padding end");
            return false;
        }

        bytes memory extractedHash = new bytes(result.length - paddingEnd - 1);
        for (uint256 k = 0; k < extractedHash.length; k++) {
            extractedHash[k] = result[paddingEnd + 1 + k];
        }

        return
            keccak256(extractedHash) == keccak256(abi.encodePacked(_message));
    }
}
