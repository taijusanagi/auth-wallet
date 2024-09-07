// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./JWT.sol";
import "./RSAPKCS1Verifier.sol";

import "./JWKSAutomatedOracle.sol";

contract AuthWallet is JWT, RSAPKCS1Verifier {
    using Base64 for string;

    JWKSAutomatedOracle public jwksAutomatedOracle;
    // Hardcoded exponent (common value for RSA public exponent)
    bytes public constant EXPONENT = hex"010001"; // 65537 in hexadecimal

    constructor(JWKSAutomatedOracle _jwksAutomatedOracle) {
        // Set the JWKSAutomatedOracle contract
        jwksAutomatedOracle = _jwksAutomatedOracle;
    }

    // Function to validate JWT
    function validateJWT(string memory _jwt) public view returns (bool) {
        // Split the JWT
        (
            string memory header,
            string memory payload,
            string memory signature
        ) = split(_jwt);

        // Extract the kid from the header
        string memory kid = getKidFromHeader(header);

        // Get the modulus for the kid
        bytes memory modulus = jwksAutomatedOracle.kidToModulus(kid);
        require(modulus.length > 0, "Modulus not found for the given kid");

        // Hash the header and payload
        bytes32 messageHash = hashHeaderAndPayload(header, payload);

        bytes memory decodedSignature = signature.decode();

        // Verify the signature
        return verify(messageHash, decodedSignature, EXPONENT, modulus);
    }
}
