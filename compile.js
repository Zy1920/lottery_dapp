//智能合约的编译
const path=require("path");
const fs=require("fs");
const solc=require("solc");

//获取智能合约的文件路径
const srcpath = path.resolve(__dirname,"contracts","Lottery.sol");
//读取文件
const source = fs.readFileSync(srcpath,"utf-8");
//solc对文件进行编译
const  result = solc.compile(source,1);
//导出
module.exports = result.contracts[":Lottery"];
console.log(result.contracts[":Lottery"].interface);