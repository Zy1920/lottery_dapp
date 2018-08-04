## 一个基于以太坊智能合约和React实现的博彩dapp

###  前端页面搭建

- ##### 安装应用程序脚手架 创建lottery 的react项目

```
npm install -g create-react-app
```

```
 create-react-app lottery-react
```

- ##### 应用程序设计

1. 展示管理员地址
2. 展示奖池金额
3. 展示参与人数
4. 展示当前期数
5. 展示投注按钮
6. 展示开奖按钮(需要管理员界面才展现)
7. 展示退款按钮(需要管理员界面才展现)



### react 快速复习

- index.html 
- src 下的css和app.js

```
npm run start 启动应用程序


http://localhost:3000
```



### 初始化web3环境

```
npm install web3 --save
```

我们需要使用web3 v0.2的provider 注入到web3 v1.0的provider的里面

创建一个web3.js文件

```
 import Web3 from 'web3';
 const web3 = new Web3(window.web3.currentProvider);
 export default web3;
```

使用的时候再import一下

```
import web3 from './web3';
```





### 部署彩票智能合约

- **通过contract abi 和地址来调用以太坊上的智能合约的实例**

运行deploy.js  compile.js，完成智能合约的编译和部署，**要打印智能合约contract的地址和contract的json ABI**



### 智能合约实例的部署和使用

用compile脚本编译得到abi, 用deploy脚本得到address

```
	import web3 from './web3';
	const address = '0x8ddddxxx';
	const abi = [{"constant": true,...}]

	export default new web3.eth.Contract(abi,address)
```



### 解析智能合约数据

导入智能合约实例，将数据展现在前端页面上，前端页面通过semantic-ui-react来实现相关的样式



```javascript
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

```



### Semantic UI的引入

```
  npm install --save semantic-ui-react
```

添加css

```
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>
```

根据需求设置ui

