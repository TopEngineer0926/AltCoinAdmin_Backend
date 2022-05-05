import Web3 from "web3";
import ERC721ABI from "src/abi/ERC721ABI";
import MaticTokenABI from "src/abi/MaticTokenABI";
import { Constants } from "src/config/constants";

const web3 = new Web3(Constants.rpcURL[80001]);

export const GetBalance = async (account) => {
    const tokenInst = new web3.eth.Contract(
        MaticTokenABI,
        Constants.token.Polygon
    );
    const _balMatic = await tokenInst.methods.balanceOf(account).call();
    return _balMatic;
};

export const GetBaseData = async (waddresss) => {
    const marketInst = new web3.eth.Contract(ERC721ABI, waddresss);
    const totalSup = await marketInst.methods
        .totalSupply()
        .call()
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.log("err", err);
            return null;
        });
    const cname = await marketInst.methods
        .name()
        .call()
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.log("err", err);
            return null;
        });
    const csymbol = await marketInst.methods
        .symbol()
        .call()
        .then((res) => {
            return res;
        })
        .catch((err) => {
            console.log("err", err);
            return null;
        });
    const baseData = { totalSupply: totalSup, name: cname, symbol: csymbol };
    return baseData;
};
