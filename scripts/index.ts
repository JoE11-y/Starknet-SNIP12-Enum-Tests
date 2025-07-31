import {
  type TypedData,
  constants,
  TypedDataRevision,
  typedData,
} from "starknet";

import { offerer_address } from "./constants";

export async function run() {
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
