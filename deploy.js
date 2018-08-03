//部署智能合约到真实的rankeby网络
const Web3 = require('web3');
const {interface,bytecode} = require('./compile');
const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = "gas north excuse ancient addict shaft marble awful panther edge bundle hill";
const provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/b5193966085f4ae0a469a7a77215b0ba");
const web3 = new Web3(provider);

deploy = async ()=>{
    console.log("hahaha")
    const accounts = await web3.eth.getAccounts();
    console.log("hahaha")
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data:bytecode
        }).send({
            from:accounts[0],
            gas:3000000
        })
    console.log("address:"+result.options.address)
}

deploy();