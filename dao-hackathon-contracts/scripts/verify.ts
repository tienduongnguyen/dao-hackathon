const CONFIG = require("../config/config.json");
const { exec } = require("child_process");
const request = require("request");
import { ethers } from "hardhat";
const Web3 = require("web3");
const fs = require("fs");

const URL_BLOCKSCOUT = "http://10.1.4.148:4000";

const powerAmount = 1000000;

const verifyRequest = async (
  addressHash: string,
  name: string,
  contractSourceCode: any,
  constructorArguments = ""
) => {
  console.log("Verify contract", addressHash, name, constructorArguments);
  return new Promise((resolve, reject) => {
    request(
      {
        method: "POST",
        url: URL_BLOCKSCOUT + "/verify_smart_contract/contract_verifications",
        headers: {
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
          "Cache-Control": "max-age=0",
          Connection: "keep-alive",
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: URL_BLOCKSCOUT,
          "Upgrade-Insecure-Requests": "1",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
        },
        form: {
          "smart_contract[address_hash]": addressHash,
          "smart_contract[name]": name,
          "smart_contract[nightly_builds]": "false",
          "smart_contract[compiler_version]": "v0.8.7+commit.e28d00a7",
          "smart_contract[evm_version]": "default",
          "smart_contract[optimization]": "true",
          "smart_contract[optimization_runs]": "200",
          "smart_contract[contract_source_code]": contractSourceCode,
          "smart_contract[autodetect_constructor_args]": "false",
          "smart_contract[constructor_arguments]": constructorArguments,
          "external_libraries[library1_name]": "",
          "external_libraries[library1_address]": "",
          "external_libraries[library2_name]": "",
          "external_libraries[library2_address]": "",
          "external_libraries[library3_name]": "",
          "external_libraries[library3_address]": "",
          "external_libraries[library4_name]": "",
          "external_libraries[library4_address]": "",
          "external_libraries[library5_name]": "",
          "smart_contract[library5_address]": "",
        },
      },
      function (error: any, response: any) {
        if (error) console.log("Error", addressHash, name);
        else resolve(response.body);
      }
    );
  });
};

const flattenContract = async (contractPath: string) => {
  return new Promise((resolve, reject) => {
    exec(
      `${__dirname}/../node_modules/.bin/hardhat flatten ${__dirname}/../${contractPath} > ${__dirname}/../flatten/flatten.sol`,
      (error: any, stdout: any, stderr: any) => {
        console.log("Verify contract", contractPath);
        const str = fs
          .readFileSync(__dirname + "/../flatten/flatten.sol")
          .toString();
        const removeSPDX = str
          .split("// SPDX-License-Identifier: MIT")
          .join("")
          .split("pragma solidity ^0.8.0;")
          .join("")
          .split("pragma solidity ^0.8.1;")
          .join("");
        const idxStart = removeSPDX.indexOf(
          "// Sources flattened with hardhat"
        );
        const processedStr = `// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n${removeSPDX.substring(
          idxStart,
          removeSPDX.length
        )}`;
        resolve(processedStr);
      }
    );
  });
};

const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const [deployer] = await ethers.getSigners();
  const MesmeGovernor = "contracts/MesmeGovernor.sol";
  const MesmePower = "contracts/MesmePower.sol";
  const MesmeTimeLock = "contracts/MesmeTimelock.sol";
  const listContract = [
    {
      path: MesmeTimeLock,
      ...CONFIG.MesmeTimelock,
      input: [
        "10",
        ["0x383eB5dF61763E223B2DA6Db2b31fce24784b41B"],
        ["0x0b704219E6E325b8967253ef1Fb2096D8fec48aA"],
        deployer.address
        ],
    },
    {
      path: MesmePower,
      ...CONFIG.MesmePower,
      input: [powerAmount],
    },
    {
      path: MesmeGovernor,
      ...CONFIG.MesmeGovernor,
      input: [CONFIG.MesmePower.address, CONFIG.MesmeTimelock.address],
    },
  ];

  for (let i = 0; i < listContract.length; i++) {
    const contract = listContract[i];
    const contractSourceCode = await flattenContract(contract.path);
    const web3 = new Web3();
    // console.log("contract abi: ", contract.abi[0].inputs);
    // console.log("contract input: ", contract.input);
    const abiParams = web3.eth.abi
      .encodeParameters(contract.abi[0].inputs, contract.input)
      .replace("0x", "");
    // console.log("abi params: ", abiParams);
    await verifyRequest(
      contract.address,
      contract.contractName,
      contractSourceCode,
      abiParams
    );

    await delay(3000);
  }
}

main();