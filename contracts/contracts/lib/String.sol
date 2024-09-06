// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library String {
    function substring(
        string memory _str,
        uint256 _start,
        uint256 _length
    ) internal pure returns (string memory) {
        bytes memory strBytes = bytes(_str);
        require(_start + _length <= strBytes.length, "Invalid substring range");

        bytes memory result = new bytes(_length);
        for (uint256 i = 0; i < _length; i++) {
            result[i] = strBytes[_start + i];
        }

        return string(result);
    }

    function indexOf(
        string memory _haystack,
        bytes memory _needle
    ) internal pure returns (uint256) {
        bytes memory haystack = bytes(_haystack);

        for (uint256 i = 0; i <= haystack.length - _needle.length; i++) {
            bool found = true;
            for (uint256 j = 0; j < _needle.length; j++) {
                if (haystack[i + j] != _needle[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return i;
        }

        return type(uint256).max;
    }
}
