// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@account-abstraction/contracts/core/Helpers.sol";

import "./JWT.sol";
import "./RSAPKCS1Verifier.sol";
import "./JWKSAutomatedOracle.sol";

contract AuthWallet is JWT, RSAPKCS1Verifier, BaseAccount {
    using Base64 for string;
    using String for string;

    IEntryPoint private _entryPoint;
    JWKSAutomatedOracle public jwksAutomatedOracle;

    string public aud;
    string public email;

    // Hardcoded exponent (common value for RSA public exponent)
    bytes public constant EXPONENT = hex"010001"; // 65537 in hexadecimal

    constructor(
        IEntryPoint entryPoint_,
        JWKSAutomatedOracle _jwksAutomatedOracle,
        string memory _aud,
        string memory _email
    ) {
        _entryPoint = entryPoint_;
        jwksAutomatedOracle = _jwksAutomatedOracle;
        initialize(_aud, _email);
    }

    function initialize(
        string memory _aud,
        string memory _email
    ) public payable virtual {
        require(
            bytes(aud).length == 0 || bytes(email).length == 0,
            "Already initialized"
        );
        aud = _aud;
        email = _email;
    }

    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    // Function to validate JWT
    function validateJWT(
        string memory _jwt
    ) public view returns (bool, bytes32) {
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
        bool isSignatureValid = verify(
            messageHash,
            decodedSignature,
            EXPONENT,
            modulus
        );

        if (!isSignatureValid) {
            return (false, bytes32(0));
        }

        (
            string memory _aud,
            string memory _email,
            string memory nonce
        ) = getAudAndEmailAndNonceFromPayload(payload);

        // Check if the aud and email are the same as the ones in the contract
        if (
            keccak256(abi.encodePacked(aud)) !=
            keccak256(abi.encodePacked(_aud))
        ) {
            return (false, bytes32(0));
        }

        if (
            keccak256(abi.encodePacked(email)) !=
            keccak256(abi.encodePacked(_email))
        ) {
            return (false, bytes32(0));
        }

        // nonce to bytes32
        return (true, nonce.hexStringToBytes32());
    }

    function _validateSignature(
        UserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override returns (uint256 validationData) {
        (bool isValid, bytes32 nonce) = validateJWT(string(userOp.signature));
        if (!isValid || nonce != userOpHash) {
            return SIG_VALIDATION_FAILED;
        }
        return 0;
    }
}
