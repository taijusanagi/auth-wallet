// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JWTRSAVerification {
    function verify(
        bytes32 _message,
        uint256 _signature,
        uint256 _exponent,
        uint256 _modulus
    ) public view returns (bool) {
        uint256 decrypted = modExp(_signature, _exponent, _modulus);
        return bytes32(decrypted) == _message;
    }

    function modExp(
        uint256 _b,
        uint256 _e,
        uint256 _m
    ) public view returns (uint256 result) {
        assembly {
            let p := mload(0x40)
            mstore(p, 0x20)
            mstore(add(p, 0x20), 0x20)
            mstore(add(p, 0x40), 0x20)
            mstore(add(p, 0x60), _b)
            mstore(add(p, 0x80), _e)
            mstore(add(p, 0xa0), _m)
            let success := staticcall(gas(), 0x05, p, 0xc0, p, 0x20)
            switch success
            case 0 {
                revert(0, 0)
            }
            default {
                result := mload(p)
            }
        }
    }
}
