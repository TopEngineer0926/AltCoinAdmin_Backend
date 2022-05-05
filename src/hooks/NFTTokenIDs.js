const Web3 = require("web3");
const constants = require("../constants");
const ERC721ABI = require("../abi/ERC721-ABI.json");
const web3 = new Web3(
  "https://rinkeby.infura.io/v3/844d522cc20143f9b896c9617e81c2c3"
);
const axios = require("axios");
const watcher = require("@makerdao/multicall");

const config = {
  rpcUrl: "https://rinkeby.infura.io/v3/844d522cc20143f9b896c9617e81c2c3",
  multicallAddress: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  interval: 1000000,
};

NFTAddress = "0x1A92f7381B9F03921564a437210bB9396471050C";
const nftContract = new web3.eth.Contract(ERC721ABI, NFTAddress);
async function base() {
  const totalSuppy = await nftContract.methods.totalSupply().call();
  const nftName = await nftContract.methods.name().call();
  const nftSymbol = await nftContract.methods.symbol().call();
  console.log("total, name, symbol", nftName);
}
base();
let nftMetadata = [];
// const NFTTokenIds = async (NFTAddress) => {
//   const nftContract = new web3.eth.Contract(ERC721ABI, NFTAddress);
//   nftMetadata = [];

// const createTokenIDWatcher = (totalSuppy) => {
//   const watcherJson = [];
//   for (let i = 0; i < totalSuppy; i++) {
//     watcherJson.push({
//       target: NFTAddress,
//       call: ["tokenByIndex(uint256)(uint256)", i],
//       returns: [["tokenId" + i, (val) => val]],
//     });
//   }
//   return watcherJson;
// };

// const createTokenURIWatcher = (tokenIDs) => {
//   const watcherJson = [];
//   for (let i = 0; i < tokenIDs.length; i++) {
//     watcherJson.push(
//       {
//         target: NFTAddress,
//         call: ["tokenURI(uint256)(string)", tokenIDs[i]],
//         returns: [["tokenURI" + i, (val) => val]],
//       },
//       {
//         target: NFTAddress,
//         call: ["ownerOf(uint256)(address)", tokenIDs[i]],
//         returns: [["owner" + i, (val) => val]],
//       }
//     );
//   }
//   return watcherJson;
// };

// const totalSuppy = await nftContract.methods.totalSupply().call();
// const nftName = await nftContract.methods.name().call();
// const nftSymbol = await nftContract.methods.symbol().call();
// console.log("total, name, symbol", nftName);
// const watcherTokenIDs = watcher.createWatcher(
//   createTokenIDWatcher(parseInt(totalSuppy)),
//   config
// );

// watcherTokenIDs.batch().subscribe(async (updates) => {
//   watcherTokenIDs.stop();
//   // Handle batched updates here
//   let tokenIds = [];
//   for (let i = 0; i < updates.length; i++) {
//     const tokenId = updates[i].value.toNumber();
//     console.log(updates[i].type, tokenId);
//     tokenIds.push(tokenId);
//   }

//   // get token uri
//   const watcherTokenURIs = watcher.createWatcher(
//     createTokenURIWatcher(tokenIds),
//     config
//   );

//   watcherTokenURIs.batch().subscribe((updates1) => {
//     watcherTokenURIs.stop();
//     console.log(updates1);
//     for (let i = 0; i < updates1.length; i++) {
//       const tokenid = tokenIds[i];
//       const tokenURI = updates1[i].tokenURI;
//       const owner = updates1[i].owner;
//       nftMetadata.push({
//         address: NFTAddress,
//         name: nftName,
//         symbol: nftSymbol,
//         owner: owner,
//         tokenId: tokenid,
//         tokenURI: tokenURI,
//       });
//     }
//   });

//   watcherTokenURIs.start();
// });

// watcherTokenIDs.start();
// console.log("nftmetadata", nftMetadata);
// return nftMetadata;
// };

// const batchFetchImageURI = async (onFinishRoyal) => {
//   let royalFinal = [];
//   for (let i = 0; i < royalTemporary.length; i++) {
//     const imageURI = await fetchURI(royalTemporary[i].tokenURI);
//     const convertedImageURI = convertUrlForIpfs(imageURI);
//     royalFinal.push({
//       x: royalTemporary[i].x,
//       y: royalTemporary[i].y,
//       src: convertedImageURI,
//       derivative: "0",
//     });
//   }
//   const tmp = { land: landTemporary, royal: royalFinal };
//   console.log("================================");
//   console.log(tmp);
//   onFinishRoyal(tmp);
// };

// const fetchURI = async (uri) => {
//   const response = await axios.get(uri);
//   const metadata = response.data;
//   const imageURI = metadata.image;
//   return imageURI;
// };

// const convertUrlForIpfs = (uri) => {
//   if (uri.indexOf("ipfs://") > -1) {
//     return "https://gateway.pinata.cloud/ipfs/" + uri.split("//")[1];
//   } else {
//     return uri;
//   }
// };

// module.exports = NFTTokenIds;
