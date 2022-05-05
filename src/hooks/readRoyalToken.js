const Web3 = require("web3");
const constants = require("../constants");
const collections_abi = require("../abi/collections");
const web3 = new Web3(constants.rpcURL);

const readRoyalToken = async (owner) => {
  let royalMetaData = [];
  for (let i = 0; i < constants.collectionIDs.length; i++) {
    const current_contract = new web3.eth.Contract(
      collections_abi[i],
      constants.collectionAddresses[i]
    );

    const myBalance = await current_contract.methods.balanceOf(owner).call();
    for (let j = 0; j < myBalance; j++) {
      const tokenId = await current_contract.methods
        .tokenOfOwnerByIndex(owner, j)
        .call();
      royalMetaData.push({ collectionId: constants.collectionIDs[i], tokenId });
    }
  }
  return royalMetaData;
};

module.exports = readRoyalToken;
