export const OmniExecutorAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_endpoint",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidDelegate",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidEndpointCall",
    type: "error",
  },
  {
    inputs: [],
    name: "LzTokenUnavailable",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "eid",
        type: "uint32",
      },
    ],
    name: "NoPeer",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "msgValue",
        type: "uint256",
      },
    ],
    name: "NotEnoughNative",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "OnlyEndpoint",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "eid",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "sender",
        type: "bytes32",
      },
    ],
    name: "OnlyPeer",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint32",
        name: "eid",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "peer",
        type: "bytes32",
      },
    ],
    name: "PeerSet",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "srcEid",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "sender",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
        ],
        internalType: "struct Origin",
        name: "origin",
        type: "tuple",
      },
    ],
    name: "allowInitializePath",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endpoint",
    outputs: [
      {
        internalType: "contract ILayerZeroEndpointV2",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "contract IAuthWalletFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "srcEid",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "sender",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
        ],
        internalType: "struct Origin",
        name: "",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
    ],
    name: "isComposeMsgSender",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isContract",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint32",
            name: "srcEid",
            type: "uint32",
          },
          {
            internalType: "bytes32",
            name: "sender",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
        ],
        internalType: "struct Origin",
        name: "_origin",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "_guid",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_executor",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_extraData",
        type: "bytes",
      },
    ],
    name: "lzReceive",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "nextNonce",
    outputs: [
      {
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "oAppVersion",
    outputs: [
      {
        internalType: "uint64",
        name: "senderVersion",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "receiverVersion",
        type: "uint64",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "eid",
        type: "uint32",
      },
    ],
    name: "peers",
    outputs: [
      {
        internalType: "bytes32",
        name: "peer",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_dstEid",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_options",
        type: "bytes",
      },
    ],
    name: "send",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_delegate",
        type: "address",
      },
    ],
    name: "setDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IAuthWalletFactory",
        name: "_factory",
        type: "address",
      },
    ],
    name: "setFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_eid",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "_peer",
        type: "bytes32",
      },
    ],
    name: "setPeer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
