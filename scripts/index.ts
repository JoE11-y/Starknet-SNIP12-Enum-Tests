import {
  type TypedData,
  constants,
  TypedDataRevision,
  typedData,
} from "starknet";

const offerer_address =
  "0x049c8ce76963bb0d4ae4888d373d223a1fd7c683daa9f959abe3c5cd68894f51";

async function run() {
  const myTypedData: TypedData = {
    domain: {
      name: "DappName",
      chainId: constants.StarknetChainId.SN_SEPOLIA,
      version: "1",
      revision: TypedDataRevision.ACTIVE,
    },
    message: {
      some_enum: {
        NATIVE: [],
      },
    },
    primaryType: "SimpleStruct",
    types: {
      StarknetDomain: [
        {
          name: "name",
          type: "shortstring",
        },
        {
          name: "version",
          type: "shortstring",
        },
        {
          name: "chainId",
          type: "shortstring",
        },
        {
          name: "revision",
          type: "shortstring",
        },
      ],
      SimpleStruct: [
        {
          name: "some_enum",
          type: "enum",
          contains: "ItemType",
        },
      ],
      ItemType: [
        {
          name: "NATIVE",
          type: "()",
        },
        {
          name: "ERC20",
          type: "()",
        },
        {
          name: "ERC721",
          type: "()",
        },
        {
          name: "ERC1155",
          type: "()",
        },
      ],
    },
  };

  const msgHash = typedData.getMessageHash(myTypedData, offerer_address);
  console.log("msgHash1=", msgHash);
}

async function main() {
  await run();
}

// Entry point
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error occurred:", error);
    process.exit(1);
  });
