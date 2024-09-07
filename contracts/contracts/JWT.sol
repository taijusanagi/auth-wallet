// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/Base64.sol";
import "./lib/String.sol";

contract JWT {
    using Base64 for string;
    using String for string;

    function split(
        string memory _jwt
    ) public pure returns (string memory, string memory, string memory) {
        bytes memory jwtBytes = bytes(_jwt);
        uint256 firstDot = 0;
        uint256 secondDot = 0;

        for (uint256 i = 0; i < jwtBytes.length; i++) {
            if (jwtBytes[i] == ".") {
                if (firstDot == 0) {
                    firstDot = i;
                } else {
                    secondDot = i;
                    break;
                }
            }
        }

        require(firstDot != 0 && secondDot != 0, "Invalid JWT format");

        string memory header = _jwt.substring(0, firstDot);
        string memory payload = _jwt.substring(
            firstDot + 1,
            secondDot - firstDot - 1
        );
        string memory signature = _jwt.substring(
            secondDot + 1,
            jwtBytes.length - secondDot - 1
        );

        return (header, payload, signature);
    }

    function getKidFromHeader(
        string memory _header
    ) public pure returns (string memory) {
        bytes memory decodedHeader = _header.decode();
        string memory headerStr = string(decodedHeader);

        bytes memory kidKey = '"kid":"';
        uint256 kidStart = headerStr.indexOf(kidKey) + kidKey.length;
        require(kidStart > kidKey.length, "kid not found in header");

        uint256 kidEnd = headerStr
            .substring(kidStart, bytes(headerStr).length - kidStart)
            .indexOf('"');
        require(kidEnd != type(uint256).max, "Invalid kid format");

        return headerStr.substring(kidStart, kidEnd);
    }

    function hashHeaderAndPayload(
        string memory _header,
        string memory _payload
    ) public pure returns (bytes32) {
        return sha256(abi.encodePacked(_header, ".", _payload));
    }
}
