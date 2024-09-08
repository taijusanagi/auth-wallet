// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";

import "./AuthWallet.sol";

contract OmniExecutor is OApp {
    constructor(address _endpoint, address _owner) OApp(_endpoint, _owner) {
        _transferOwnership(_owner);
    }

    function send(
        uint32 _dstEid,
        address to,
        uint256 value,
        bytes calldata data,
        bytes calldata _options
    ) external payable {
        bytes memory _payload = abi.encode(msg.sender, to, value, data);
        _lzSend(
            _dstEid,
            _payload,
            _options,
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata payload,
        address,
        bytes calldata
    ) internal override {
        (
            address payable account,
            address to,
            uint256 value,
            bytes memory data
        ) = abi.decode(payload, (address, address, uint256, bytes));
        AuthWallet(account).execute(to, value, data);
    }
}
