// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./lib/Base64.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract JWKSAutomatedOracle is FunctionsClient, AutomationCompatibleInterface {
    using Base64 for string;
    using FunctionsRequest for FunctionsRequest.Request;

    error UnexpectedRequestID(bytes32 requestId);

    // Chainlink Functions Data
    string public kidSource =
        "const { Buffer } = await import('node:buffer');"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: 'https://www.googleapis.com/oauth2/v3/certs'"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.keys[0].kid);";

    string public modulusSource =
        "const { Buffer } = await import('node:buffer');"
        "const kid = args[0];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: 'https://www.googleapis.com/oauth2/v3/certs'"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "const jwk = data.keys.find((jwk) => jwk.kid == kid);"
        "return Buffer.from(jwk.n, 'base64');";

    uint64 public subscriptionId;
    uint32 public gasLimit;
    bytes32 public donID;
    bytes32 public s_lastRequestId;

    // Chainlink Automation Data
    uint256 public interval = 1 hours;
    uint256 public lastTimeStamp;

    // App Data
    string public processingKid;
    mapping(string => bytes) public kidToModulus;

    constructor(
        address router,
        uint64 _subscriptionId,
        uint32 _gasLimit,
        bytes32 _donID
    ) FunctionsClient(router) {
        subscriptionId = _subscriptionId;
        gasLimit = _gasLimit;
        donID = _donID;
    }

    // Chainlink Functions Methods
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        if (bytes(processingKid).length == 0) {
            _setProcessingKid(string(response));
            _requestModulus();
        } else {
            _setModulus(response);
        }
    }

    function _requestKid() internal returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(kidSource);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    function _requestModulus() internal returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(modulusSource);
        string[] memory args = new string[](1);
        args[0] = processingKid;
        req.setArgs(args);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    // Chainlink Automation Methods
    function checkUpkeep(
        bytes calldata
    ) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            _requestKid();
        }
    }

    // App Methods
    function _setProcessingKid(string memory _kid) internal {
        require(bytes(processingKid).length == 0, "Kid already set");
        processingKid = _kid;
    }

    function _setModulus(bytes memory _modulus) internal {
        require(bytes(processingKid).length > 0, "No processing kid set");
        kidToModulus[processingKid] = _modulus;
        delete processingKid;
    }
}
