import {
  CONTRACT,
  Connection,
  Card,
  CardPosition,
  Governor,
  Authenticator,
  TimeLock,
} from "bupbethuytinh";

const connection = new Connection(`${process.env.NETWORK_RPC}`);

const governor = new Governor(
  connection,
  CONTRACT.MesmeGovernor.abi,
  CONTRACT.MesmeGovernor.address
);
const cardPosition = new CardPosition(
  connection,
  CONTRACT.CardPosition.abi,
  CONTRACT.CardPosition.address
);
const card = new Card(connection, CONTRACT.Card.abi, CONTRACT.Card.address);
const authenticator = new Authenticator(
  connection,
  CONTRACT.Authenticator.abi,
  CONTRACT.Authenticator.address
);
const timeLock = new TimeLock(
  connection,
  CONTRACT.MesmeTimelock.abi,
  CONTRACT.MesmeTimelock.address
);

const getTotalNFT = async () => {
  const contract = new connection.web3.eth.Contract(
    CONTRACT.Card.abi,
    CONTRACT.Card.address
  );
  return await contract.methods.totalSupply().call();
};

const getTotalRewards = async () => {
  return connection.web3.eth.getBalance(CONTRACT.MesmeGovernor.address);
};

export {
  connection,
  governor,
  cardPosition,
  card,
  authenticator,
  timeLock,
  getTotalNFT,
  getTotalRewards,
};
