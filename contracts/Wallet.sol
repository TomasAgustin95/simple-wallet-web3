// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


//Wallet Smat Contract 
contract Wallet {

    string public walletName;
    address private owner;

    //Events 
    event Transfer(address sender, address recipent, uint amount);
    event Receive(address _from, uint _amount);

    mapping (address => uint) _balance;
    mapping (address => mapping(address => uint)) _tokenBalance;

    constructor() {
        owner = msg.sender; // Function to receive Ether. msg.data must be empty
        walletName = "Huzaifa Wallet";
    }

    //Function to receive Ether
    receive() external payable {
        _balance[msg.sender] = _balance[msg.sender]+(msg.value);

        emit Receive(msg.sender, msg.value);
    }

    //Function to send Ether
    function send(address payable recipient, uint amount) public {
        require(_balance[msg.sender] >= amount, "Not enough funds");
        recipient.transfer(amount);
        _balance[msg.sender] = _balance[msg.sender]-(amount);
        _balance[recipient] = _balance[recipient]+(amount);

        emit Transfer(msg.sender, recipient, amount);
    }

    //Function to deposit ERC20 token
    function depositERC20(address _tokenAddress, uint amount) public {
        IERC20 _token = IERC20(_tokenAddress);
        require(_token.transferFrom(msg.sender, address(this), amount), "Transaction Failed");
        _tokenBalance[msg.sender][_tokenAddress] = _tokenBalance[msg.sender][_tokenAddress]+(amount);
    }

    //Function to withdraw ERC20 token 
    function withDrawERC20(address _tokenAddress, uint amount) public {
        IERC20 _token = IERC20(_tokenAddress);
        require(_tokenBalance[msg.sender][_tokenAddress] >= amount, "Not Enough Tokens");
        require(_token.transfer(msg.sender, amount));
        _tokenBalance[msg.sender][_tokenAddress] = _tokenBalance[msg.sender][_tokenAddress]-(amount);

        emit Transfer(msg.sender, _tokenAddress, amount);
    }

    // A simplified and not real swap function
    function swap(address _tokenA, address _tokenB, uint amount) public {
        IERC20 token1 = IERC20(_tokenA);
        IERC20 token2 = IERC20(_tokenB);

        require(_tokenBalance[msg.sender][_tokenA] >= amount);
        require(token1.transferFrom(msg.sender, address(this), amount));
        require(token2.transfer(msg.sender, amount));

        // For the sake of simplicity, we will just swap 1:1, but in real scenarios, 
        // you need to integrate price feed oracles or DEXs to get real-time rates.
        _tokenBalance[msg.sender][_tokenA] = _tokenBalance[msg.sender][_tokenA]-(amount);
        _tokenBalance[msg.sender][_tokenB] = _tokenBalance[msg.sender][_tokenB]+(amount);
        
    }

    // Additional utility functions to query balances
    function getEtherBalance(address account) public view returns(uint) {
        return _balance[account];
    }

    function getTokenBalance(address account, address _tokenAddress) public view returns(uint) {
        return _tokenBalance[account][_tokenAddress];
    }

}