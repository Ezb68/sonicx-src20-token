const BigNumber = require('bignumber.js');
const SonicxWeb = require('sonicxweb');

const gPrivateKey = 'D8B708BFFFA424473D83349CF4C6A2395E4436E065B60F0BF31E582281256D1C';

const sonicxWeb = new SonicxWeb({
    fullNode: 'https://fullnode.sonicxhub.com',
    solidityNode: 'https://solnode.sonicxhub.com',
    eventServer: 'https://event.sonicxhub.com/',
    // fullNode: 'http://10.70.1.192:8190',
    // solidityNode: 'http://10.70.1.192:8191',
    // eventServer: 'http://10.70.1.192:8080',
    privateKey: gPrivateKey,
  }
)
var contract = require('./build/contracts/SRC20.json');

getSoxBalance = async (address) => {
    try {
        const res = await sonicxWeb.trx.getBalance(address);
        const balance = new BigNumber(res);
        return balance.shiftedBy(-6);
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getToken = (contractAddress) => {
    const contractHexAddress = sonicxWeb.address.toHex(contractAddress);
    const token = sonicxWeb.contract(contract.abi, contractHexAddress);
    return token
}

getName = async (token) => {
    try {
        res = await token.name().call();
        return res;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getSymbol = async (token) => {
    try {
        res = await token.symbol().call();
        return res;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getDecimals = async (token) => {
    try {
        res = await token.decimals().call();
        return res;
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getTotalSupply = async (token, decimals = 8) => {
    try {
        res = await token.totalSupply().call();
        const supply = new BigNumber(res.supply);
        return supply.shiftedBy(-decimals);
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getBalance = async (token, address, decimals = 8) => {
    try {
        const res = await token.balanceOf(address).call();
        const balance = new BigNumber(res.balance);
        return balance.shiftedBy(-decimals);
    } catch (err) {
        console.log(err);
        return 0;
    }
}

getAllowance = async (token, owner, spender, decimals = 8) => {
    try {
        const res = await token.allowance(owner, spender).call();
        const allowance = new BigNumber(res.remaining);
        return allowance.shiftedBy(-decimals);
    } catch (err) {
        console.log(err);
        return new BigNumber(0);
    }
}

transfer = async (token, toAddress, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let txId = await token.transfer(toAddress, amount).send({
                shouldPollResponse: false,
                callValue: 0
            });
        return txId;
    } catch (err) {
        console.log(err);
        return null;
    }
},

transferAndConfirm = async (token, toAddress, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let ret = await token.transfer(toAddress, amount).send({
                shouldPollResponse: true,
                keepTxID: true,
                callValue: 0
            });
        if (ret) {
            return ret[0]; // return txid
        }
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
},

approve = async (token, spender, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let res = await token.approve(spender, amount).send({
                shouldPollResponse: false,
                callValue: 0
            });
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}

increaseAllowance = async (token, spender, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let res = await token.increaseAllowance(spender, amount).send({
                shouldPollResponse: false,
                callValue: 0
            });
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}

decreaseAllowance = async (token, spender, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let res = await token.decreaseAllowance(spender, amount).send({
                shouldPollResponse: false,
                callValue: 0
            });
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}

transferFrom = async (token, fromAddress, toAddress, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let txId = await token.transferFrom(fromAddress, toAddress, amount).send({
                shouldPollResponse: false,
                callValue: 0
            });
        return txId;
    } catch (err) {
        console.log(err);
        return null;
    }
},

mint = async (token, to, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let res = await token.mint(to, amount).send({
                shouldPollResponse: false,
                callValue: 0
            });
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}

burn = async (token, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let res = await token.burn(amount).send({
                shouldPollResponse: false,
                callValue: 0
            });
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}

burnFrom = async (token, from, amount, privateKey) => {
    try {
        sonicxWeb.setPrivateKey(privateKey);
        let res = await token.burnFrom(from, amount).send({
                shouldPollResponse: false,
                callValue: 0
            });
        return res;
    } catch (err) {
        console.log(err);
        return false;
    }
}

startEventListener = async () => {
    const contractAddress = "SjnYdUrA3suZXmi6G8t7r7YSsVHheK56oZ"; // for test

    const spender = 'SRsPtnVinRTky2tE2Z9RYeNs12PLywNUeQ';
    const address = 'SNA5wY1EQn1NCJPBPmNC5mb4D1enyw72aj';
    const toAddress = 'SgvT8Qz3fQQcqLfufC3tro6JnD2cMpLdnz';
    const privateKey = gPrivateKey;

    // const soxBalance = await getSoxBalance(address)
    // console.log('SOX balance=', soxBalance.toString());

    tokenObj = getToken(contractAddress)

    const name = await getName(tokenObj)
    console.log('name=', name);

    const symbol = await getSymbol(tokenObj)
    console.log('symbol=', symbol);

    const decimals = await getDecimals(tokenObj)
    console.log('decimals=', decimals);

    const supply = await getTotalSupply(tokenObj, decimals)
    console.log('totalSupply=', supply.toString());

    // const balance = await getBalance(tokenObj, address, decimals)
    // console.log('balance=', balance.toString());

    // const allowance = await getAllowance(tokenObj, address, spender, decimals)
    // console.log('allowance=', allowance.toString());

    // let approveAmount = new BigNumber(10.23);
    // approveAmount = approveAmount.shiftedBy(decimals).integerValue();
    // let ret = await approve(tokenObj, spender, approveAmount.toNumber(), privateKey)
    // console.log("approved:", ret);

    // let sendAmount = new BigNumber(10);
    // sendAmount = sendAmount.shiftedBy(decimals).integerValue();
    // let txId = await transferAndConfirm(tokenObj, toAddress, sendAmount.toNumber(), privateKey)
    // if (txId) {
    //     console.log("txId=", txId);
    // }
}
startEventListener();
