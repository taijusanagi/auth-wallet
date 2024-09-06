// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RSAPKCS1Verifier {
    /// @notice Verifies an RSA signature using PKCS#1 v1.5 padding
    /// @param _message The original message hash (32 bytes)
    /// @param _signature The RSA signature to verify
    /// @param _exponent The public exponent of the RSA key
    /// @param _modulus The modulus of the RSA key
    /// @return bool True if the signature is valid, false otherwise
    function verify(
        bytes32 _message,
        bytes calldata _signature,
        bytes calldata _exponent,
        bytes calldata _modulus
    ) public view returns (bool) {
        // Prepare input for the modular exponentiation precompile
        bytes memory input = abi.encodePacked(
            uint256(_signature.length),
            uint256(_exponent.length),
            uint256(_modulus.length),
            _signature,
            _exponent,
            _modulus
        );

        // Call the modular exponentiation precompile (address 0x05)
        (bool success, bytes memory result) = address(0x05).staticcall(input);
        require(success, "Modular exponentiation failed");

        // Verify PKCS#1 v1.5 padding structure
        // The result should start with 0x00 0x01
        if (result.length < 11 || result[0] != 0x00 || result[1] != 0x01) {
            return false;
        }

        // Find the end of the padding (0xFF bytes)
        uint256 paddingEnd = 2;
        while (paddingEnd < result.length && result[paddingEnd] == 0xFF) {
            paddingEnd++;
        }

        // Verify that the padding is followed by a 0x00 byte
        if (paddingEnd + 1 >= result.length || result[paddingEnd] != 0x00) {
            return false;
        }

        // Extract the message hash from the decrypted signature
        uint256 hashLength = result.length - paddingEnd - 1;
        bytes memory extractedHash = new bytes(hashLength);
        for (uint256 k = 0; k < hashLength; k++) {
            extractedHash[k] = result[paddingEnd + 1 + k];
        }

        // Compare the extracted hash with the provided message
        return
            keccak256(extractedHash) == keccak256(abi.encodePacked(_message));
    }
}
