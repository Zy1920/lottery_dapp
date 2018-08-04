import React, { Component } from 'react';
import {Message,Container,Card,Icon,Image,Button,Statistic,Label} from 'semantic-ui-react';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

    state={
        manager:"",
        playersCount:0,
        balance:0,
        loading:false,
        showbutton:'none',
        ploading:false,
        rloading:false

    }

    enter = async ()=>{
        this.setState({loading:true});
        //获取账户
        const accounts = await web3.eth.getAccounts();
        //拿着彩票智能合约调用enter方法
        await lottery.methods.enter().send({
            from:accounts[0],
            value:'3000000'
        });
        this.setState({loading:false});
        window.location.reload(true);
    };


    pickWinner = async ()=>{
        this.setState({ploading:true});
        //获取账户
        const accounts = await web3.eth.getAccounts();
        //拿着彩票智能合约调用pickWinner方法
        await  lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        this.setState({ploading:false});
        window.location.reload(true);
    };

    refund=async()=>{
        this.setState({rloading:true});
        const accounts=await web3.eth.getAccounts();
        await lottery.methods.refund().send({
            from:accounts[0]
        });
        this.setStatr({rloading:false});
        window.location.reload(true);

    }

    async componentDidMount(){
        const address=await lottery.methods.getManager().call();
        const playersCount=await lottery.methods.getPlayersCount().call();
        const balance=await lottery.methods.getBalance().call();
        this.setState({
            manager:address,
            playersCount:playersCount,
            balance:web3.utils.fromWei(balance,'ether')

    })
        const accounts = await web3.eth.getAccounts();
        if(accounts[0] === address){
            //当前登录进来的是管理员
            this.setState({showbutton:'inline'});
        }else{
            //不是管理员
            this.setState({showbutton:'none'});
        }

    }

    render() {
        return (
            <Container>
                <br/>
                <Message info>
                    <Message.Header>自定义区块链彩票项目</Message.Header>
                    <p>走过路过不要错过</p>
                </Message>
                <Card>
                    <Image src="./images/logo.jpg" />
                    <Card.Content>
                        <Card.Header>六合彩</Card.Header>
                        <Card.Meta>
                            <p>管理员地址</p>
                            <Label size='mini'>
                                {this.state.manager}
                            </Label>
                        </Card.Meta>
                        <Card.Description>每周三晚上8点准时开奖</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <a>
                            <Icon name='user' />
                            {this.state.playersCount}人参与
                        </a>
                    </Card.Content>
                    <Card.Content extra>
                        <Statistic color='red'>
                            <Statistic.Value>{this.state.balance}ether </Statistic.Value>
                        </Statistic>
                    </Card.Content>
                    <Button animated='fade' onClick={this.enter} loading={this.state.loading}
                            disabled={this.state.loading}>
                        <Button.Content visible>投注产生希望</Button.Content>
                        <Button.Content hidden>购买放飞梦想</Button.Content>
                    </Button>
                    <Button color='yellow' style={{display: this.state.showbutton}}
                            onClick={this.pickWinner} ploading={this.state.ploading}>开奖</Button>
                    <Button color='red' style={{display: this.state.showbutton}} onClick={this.refund} reloading={this.state.rloading}>退钱</Button>
                </Card>
            </Container>
        );
    }
}

export default App;
