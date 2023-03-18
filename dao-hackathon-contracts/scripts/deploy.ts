import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();
  const authenticatorContract = "Authenticator";
  const cardPositionContract = "CardPosition";
  const cardContract = "Card";
  const timelockContract = "MesmeTimelock";
  const governorContract = "MesmeGovernor";

  console.log("Deploying contracts with the account:", deployer.address);
  const balance: any = await deployer.getBalance();
  console.log(`Account balance: ${balance / 10 ** 18} ETH`);

  const Authenticator = await ethers.getContractFactory(authenticatorContract);
  const authenticator = await Authenticator.deploy();
  await authenticator.deployed();

  console.log(authenticatorContract, authenticator.address);

  const CardPosition = await ethers.getContractFactory(cardPositionContract);
  const cardPosition = await CardPosition.deploy(authenticator.address);
  await cardPosition.deployed();

  console.log(cardPositionContract, cardPosition.address);

  const Card = await ethers.getContractFactory(cardContract);
  const card = await Card.deploy("Mesme Card", "MEC", cardPosition.address);
  await card.deployed();

  console.log(cardContract, card.address);

  const Timelock = await ethers.getContractFactory(timelockContract);
  const timelock = await Timelock.deploy(
    "5",
    ["0x383eB5dF61763E223B2DA6Db2b31fce24784b41B"],
    ["0x0b704219E6E325b8967253ef1Fb2096D8fec48aA"],
    deployer.address
  );
  await timelock.deployed();

  console.log(timelockContract, timelock.address);

  const Governor = await ethers.getContractFactory(governorContract);
  const governor = await Governor.deploy(card.address, timelock.address);
  await governor.deployed();

  console.log(governorContract, governor.address);

  await authenticator.setCardContract(card.address);

  // create config file
  fs.writeFileSync(
    "./config/config.json",
    JSON.stringify({

      Authenticator: {
        address: authenticator.address,
        abi: require("../artifacts/contracts/auth/Authenticator.sol/Authenticator.json")
          .abi,
        bytecode:
          require("../artifacts/contracts/auth/Authenticator.sol/Authenticator.json")
            .bytecode,
        contractName:
          require("../artifacts/contracts/auth/Authenticator.sol/Authenticator.json")
            .contractName,
      },

      CardPosition: {
        address: cardPosition.address,
        abi: require("../artifacts/contracts/card/CardPosition.sol/CardPosition.json")
          .abi,
        bytecode:
          require("../artifacts/contracts/card/CardPosition.sol/CardPosition.json")
            .bytecode,
        contractName:
          require("../artifacts/contracts/card/CardPosition.sol/CardPosition.json")
            .contractName,
      },

      Card: {
        address: card.address,
        abi: require("../artifacts/contracts/card/Card.sol/Card.json").abi,
        bytecode: require("../artifacts/contracts/card/Card.sol/Card.json").bytecode,
        contractName: require("../artifacts/contracts/card/Card.sol/Card.json")
          .contractName,
      },

      MesmeGovernor: {
        address: governor.address,
        abi: require("../artifacts/contracts/dao/MesmeGovernor.sol/MesmeGovernor.json")
          .abi,
        bytecode:
          require("../artifacts/contracts/dao/MesmeGovernor.sol/MesmeGovernor.json")
            .bytecode,
        contractName:
          require("../artifacts/contracts/dao/MesmeGovernor.sol/MesmeGovernor.json")
            .contractName,
      },

      MesmeTimelock: {
        address: timelock.address,
        abi: require("../artifacts/contracts/dao/MesmeTimelock.sol/MesmeTimelock.json")
          .abi,
        bytecode:
          require("../artifacts/contracts/dao/MesmeTimelock.sol/MesmeTimelock.json")
            .bytecode,
        contractName:
          require("../artifacts/contracts/dao/MesmeTimelock.sol/MesmeTimelock.json")
            .contractName,
      },
    })
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
