const Web3 = require("web3");
const axios = require("axios");
// const Contract = require("@ethersproject/contracts");
const marketplaceABI = require("../abi/MarketPlace-ABI.json");

const web3 = new Web3(
  "https://rinkeby.infura.io/v3/844d522cc20143f9b896c9617e81c2c3"
);
const MarketPlaceAddress = "0x890eb30e925af79d545c12afb00dd5e3e67d8c6b";
const wcontract = new web3.eth.Contract(marketplaceABI, MarketPlaceAddress);
// async function getMarket() {
//   const MarketItem = await wcontract.methods.fetchMarketItems().call();
//   return MarketItem;
// }
// const MarketItems = getMarket();

// console.log("marketItem", MarketItems);
const FetchMetadata = async (uri) => {
  const response = await axios.get(uri);
  const metadata = response.data;
  // const imageURI = metadata.image;
  return metadata;
};
const metadata = FetchMetadata(
  "https://gateway.pinata.cloud/ipfs/QmejLxHcSeBC2ktpugudoHWagUBoYjyfT2f12AepvjPLUY/1"
);
console.log("metadata", metadata);
