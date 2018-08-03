
pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players;

    //构造方法中完成manager的初始化
    function Lottery() public{
        manager=msg.sender;
    }

    //投注流程，注意需要投注金额的确认
    function enter() public payable {
        require(msg.value==1 ether);
        players.push(msg.sender);
    }

    //获取所有的投注者
    function allPlayers() public view returns(address[]) {
        return players;
    }

    //获取奖池金额
    function getBalance() public view returns(uint){
        return this.balance;
    }

    //获取购买彩票的人数
    function getPlayersCount() public view returns(uint){
        return players.length;
    }

    //随机数逻辑，只有区块链内部可以进行调用
    function randomOne() private view returns(uint){
        return uint(keccak256(block.difficulty,now,players));
    }

    //选择一个幸运儿，由管理员挑选
    function pickWinner() public onlyManagerCanCall returns(address){
        uint index=randomOne() % players.length;
        address winner = players[index];
        players = new address[](0) ;
        winner.transfer(this.balance);
        return winner;
    }

    //退款流程
    function refund() public onlyManagerCanCall{
        for(uint i=0;i<players.length;i++){
            players[i].transfer(1 ether);
        }
        players=new address[](0);
    }

    function getManager() public view returns(address){
        return manager;
    }

    modifier onlyManagerCanCall(){
        require(msg.sender == manager);
        _;
    }
}