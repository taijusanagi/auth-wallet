// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RSAVerification {
    function verify(
        uint256 _D,
        uint256 _C,
        uint256 _c,
        uint256 _h,
        uint256 _z,
        uint256 _g,
        uint256 _l,
        uint256 _modulus
    ) public view returns (bool) {
        uint256 exp1 = modExp(_C, _c, _modulus);
        uint256 exp2 = modExp(_h, _z, _modulus);
        uint256 exp3 = modExp(_g, _l, _modulus);

        uint256 result = mulmod(mulmod(exp1, exp2, _modulus), exp3, _modulus);
        return _D == result;
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
