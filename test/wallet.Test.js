const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Wallet Contract", () => {

    let wallet, owner, addr1, addr2, token, tokenBefore, tokenAfter;
    let walletBeforeBalance, walletAfterBalance;
    let ownerBeforeBalance, ownerAfterBalance;
    let addr1BeforeBalance, addr1AfterBalance;
    let addr2BeforeBalance, addr2AfterBalance;
    let transaction = ethers.utils.parseEther("100"); 

    beforeEach(async () => {
        // Deploy HuziToken 
        let Token = await ethers.getContractFactory("HuziToken");
        token = await Token.deploy("Huzaifa", "HUZI", 10000);
        await token.deployed();

        // Deploy Wallet Contract
        let Wallet = await ethers.getContractFactory("Wallet");
        [owner, addr1, addr2, _] = await ethers.getSigners();
        wallet = await Wallet.deploy();
        await wallet.deployed();
    });

    it("should deploy Successfuly", async () => {
        expect(await wallet.walletName()).to.equal("Huzaifa Wallet");
        expect(await token.name()).to.equal("Huzaifa");
        expect(await token.symbol()).to.equal("HUZI");
        expect((await token.totalSupply()).toNumber()).to.equal(10000);
        const ownerBalance = await token.balanceOf(await token.signer.getAddress());
        expect(ownerBalance.toNumber()).to.equal(10000);
    });

    describe("Ether Transaction", () => {
        it("Should receive Ether", async () => {

            // Wallet balance before transaction
            walletBeforeBalance = await ethers.provider.getBalance(wallet.address);
            console.log(`Wallet Before Balance: ${walletBeforeBalance}`);

            // Owner balance before transaction
            ownerBeforeBalance = await wallet.getEtherBalance(owner.address);
            console.log(`Owner Before Balance: ${ownerBeforeBalance}`);

            // Addr1 balance before transaction
            addr1BeforeBalance = await wallet.getEtherBalance(addr1.address);
            console.log(`Addr1 Before Balance ${addr1BeforeBalance}`);

            // Addr2 balance before transaction
            addr2BeforeBalance = await wallet.getEtherBalance(addr2.address);
            console.log(`Addr2 Before Balance ${addr2BeforeBalance}`);
            
            await owner.sendTransaction({
                to: wallet.address,
                value: transaction
            });

            await addr1.sendTransaction({
                to: wallet.address,
                value: transaction
            });

            await addr2.sendTransaction({
                to: wallet.address,
                value: transaction
            });

            console.log("Transaction Amount", ethers.utils.formatEther(transaction));

            // Wallet has a total balance of all transaction
            walletAfterBalance = await ethers.provider.getBalance(wallet.address);
            console.log(`Wallet After Balance ${ethers.utils.formatEther(walletAfterBalance)}`);

            // Owner Balance after transaction
            ownerAfterBalance = await wallet.getEtherBalance(owner.address);
            console.log(`Owner After Balance ${ethers.utils.formatEther(ownerAfterBalance)}`);

            // Addr1 balance after transaction 
            addr1AfterBalance = await wallet.getEtherBalance(addr1.address);
            console.log(`Addr1 After Balance ${ethers.utils.formatEther(addr1AfterBalance)}`);

            // Addr2 balance after transaction
            addr2AfterBalance = await wallet.getEtherBalance(addr2.address);
            console.log(`Addr2 After Balance ${ethers.utils.formatEther(addr2AfterBalance)}`);

            expect(walletBeforeBalance.toString())
            .to.equal(walletAfterBalance
                .sub(ownerAfterBalance).sub(addr1AfterBalance).sub(addr2AfterBalance)
                .toString());
            console.log("Wallet Expect complete");

            expect(ownerAfterBalance.toString()).to.equal(ownerBeforeBalance.add(transaction).toString());
            console.log("Owner expect complete");
            expect(addr1AfterBalance.toString()).to.equal(addr1BeforeBalance.add(transaction).toString());
            console.log("Addr1 Expect complete");
            expect(addr2AfterBalance.toString()).to.equal(addr2BeforeBalance.add(transaction).toString());
            console.log("Addr2 Expect complete");
        });
        
        it("Should Send Ether", async() => {
            await owner.sendTransaction({
                to: wallet.address,
                value: transaction
            });

            await addr1.sendTransaction({
                to: wallet.address,
                value: transaction
            });

            // Wallet balance before transaction
            walletBeforeBalance = await ethers.provider.getBalance(wallet.address);
            console.log(`Wallet Before Balance: ${ethers.utils.formatEther(walletBeforeBalance)}`);
 
            // Owner balance before transaction
            ownerBeforeBalance = await wallet.getEtherBalance(owner.address);
            console.log(`Owner Before Balance: ${ethers.utils.formatEther(ownerBeforeBalance)}`);
 
            // Addr1 balance before transaction
            addr1BeforeBalance = await wallet.getEtherBalance(addr1.address);
            console.log(`Addr1 Before Balance ${ethers.utils.formatEther(addr1BeforeBalance)}`);
 
            // Addr2 balance before transaction
            addr2BeforeBalance = await wallet.getEtherBalance(addr2.address);
            console.log(`Addr2 Before Balance ${ethers.utils.formatEther(addr2BeforeBalance)}`);

            // Sending ethers from Owner to Addr1
            // await wallet.send(addr2.address, transaction); 
            await wallet.connect(owner).send(addr2.address, transaction);

            // Sending ethers form Addr1 to Addr2
            await wallet.connect(addr1).send(addr2.address, transaction);

            console.log("Transaction Amount", ethers.utils.formatEther(transaction));

            // Wallet has a total balance of all transaction
            walletAfterBalance = await ethers.provider.getBalance(wallet.address);
            console.log(`Wallet After Balance ${ethers.utils.formatEther(walletAfterBalance)}`);

            // Owner Balance after transaction
            ownerAfterBalance = await wallet.getEtherBalance(owner.address);
            console.log(`Owner After Balance ${ethers.utils.formatEther(ownerAfterBalance)}`);

            // Addr1 balance after transaction 
            addr1AfterBalance = await wallet.getEtherBalance(addr1.address);
            console.log(`Addr1 After Balance ${ethers.utils.formatEther(addr1AfterBalance)}`);

            // Addr2 balance after transaction
            addr2AfterBalance = await wallet.getEtherBalance(addr2.address);
            console.log(`Addr2 After Balance ${ethers.utils.formatEther(addr2AfterBalance)}`);

            expect(walletBeforeBalance.toString())
            .to.equal(walletAfterBalance
                .add(addr2AfterBalance)
                .toString());
            console.log("Wallet Expect complete");

            expect(ownerAfterBalance.toString()).to.equal(ownerBeforeBalance.sub(transaction).toString());
            console.log("Owner expect complete");

            expect(addr1AfterBalance.toString()).to.equal(addr1BeforeBalance.sub(transaction).toString());
            console.log("Addr1 Expect complete");

            expect(addr2AfterBalance.toString()).to.equal(addr2BeforeBalance.add(addr1BeforeBalance).add(ownerBeforeBalance).toString());
            console.log("Addr2 Expect complete");
        });

        describe("Token Transaction", () => {
            it("Should deposit token", async () => {
                // Owner token balance before transaction
                ownerBeforeBalance = await wallet.getTokenBalance(owner.address, token.address);
                console.log("Owner token balance before", ownerBeforeBalance.toString());

                // Approvethe contract to send 100 tokens to wallet 
                await token.approve(wallet.address, 100);

                // tokens before transfer
                tokenBefore = await token.balanceOf(await token.signer.getAddress())
                console.log(`Tokens ${tokenBefore}`);

                // Deposit 100 tokens from `HuziToken` to `Wallet` Owner address
                await wallet.depositERC20(token.address, 100); 
                // tokens after transfer
                tokenAfter = await token.balanceOf(await token.signer.getAddress())
                console.log(`Tokens ${tokenAfter}`);

                // Owner token balance after transaction
                ownerAfterBalance = await wallet.getTokenBalance(owner.address, token.address);
                console.log("Owner token balance after", ownerAfterBalance.toString());

                expect(ownerBeforeBalance.toString()).to.equal(ownerAfterBalance.sub(100).toString());
                console.log("Owner expect complete");
                expect(tokenAfter.toString()).to.equal(tokenBefore.sub(100).toString());
                console.log("Token expect complete");
            });

            it("Should with draw tokens", async ()=> {
                // Approvethe contract to send 100 tokens to wallet 
                await token.approve(wallet.address, 100);

                // Deposit 100 tokens from `HuziToken` to `Wallet` Owner address
                await wallet.depositERC20(token.address, 100); 

                // tokens before transfer
                tokenBefore = await token.balanceOf(await token.signer.getAddress())
                console.log(`Tokens Before WithDraw ${tokenBefore}`);

                // Owner token balance before transaction
                ownerBeforeBalance = await wallet.getTokenBalance(owner.address, token.address);
                console.log("Owner token balance before", ownerBeforeBalance.toString());

                // With Draw 50 tokens from owner address to HuziToken address
                await wallet.withDrawERC20(token.address, 50); 

                console.log("With Draw 50 Tokens");
                // tokens after transfer
                tokenAfter = await token.balanceOf(await token.signer.getAddress())
                console.log(`Tokens After Withdraw ${tokenAfter}`);

                // Owner token balance after transaction
                ownerAfterBalance = await wallet.getTokenBalance(owner.address, token.address);
                console.log("Owner token balance after", ownerAfterBalance.toString());

                expect(ownerBeforeBalance.toString()).to.equal(ownerAfterBalance.add(50).toString());
                console.log("Owner expect complete");
                expect(tokenAfter.toString()).to.equal(tokenBefore.add(50).toString());
                console.log("Token expect complete");
            });
        });

        describe("Token Swap", () => {
            it("Should Swap tokens", async () => {

                const TokenB = await ethers.getContractFactory("HuziToken");
                const tokenB = await TokenB.deploy("Shahrukh", "SRK", 10000);
                await tokenB.deployed();

                console.log("Should Deploy successfully");
                expect(await tokenB.name()).to.equal("Shahrukh");
                expect(await tokenB.symbol()).to.equal("SRK");
                expect((await tokenB.totalSupply()).toNumber()).to.equal(10000);
                const ownerBalance = await tokenB.balanceOf(await tokenB.signer.getAddress());
                expect(ownerBalance.toNumber()).to.equal(10000);
                console.log("successfully Deploy ");

                // tokens A before transfer
                tokenBefore = await token.balanceOf(await token.signer.getAddress())
                console.log(`Token A Balance Before ${tokenBefore}`);

                // tokens B before transfer
                tokenBefore = await tokenB.balanceOf(await tokenB.signer.getAddress())
                console.log(`Token B Balance Before ${tokenBefore}`);

                // Owner token A balance before transaction
                ownerBeforeBalance = await wallet.getTokenBalance(owner.address, token.address);
                console.log("Owner A token balance before", ownerBeforeBalance.toString());

                // Owner token B balance before transaction
                ownerBeforeBalance = await wallet.getTokenBalance(owner.address, tokenB.address);
                console.log("Owner B token balance before", ownerBeforeBalance.toString());

                // Approvethe contract to send 100 tokens to wallet 
                await token.approve(wallet.address, 200);
                await tokenB.approve(wallet.address, 200);
                console.log("Approve Successfuly");
                
                // Deposit 100 tokens from `tokenA, token B` to `Wallet` Owner address
                await wallet.depositERC20(token.address, 100); 
                console.log("Deposit Token A Successfuly");
                await wallet.depositERC20(tokenB.address, 100); 
                console.log("Deposit Token B Successfuly");

                // tokens A after transfer
                tokenAfter = await token.balanceOf(await token.signer.getAddress())
                console.log(`Token A Balance After Transfer: ${tokenAfter}`);

                // tokens B after transfer
                tokenAfter = await tokenB.balanceOf(await tokenB.signer.getAddress())
                console.log(`Token B Balance After Transfer: ${tokenAfter}`);

                // Owner Token A balance after Transfer
                let ownerAfterBalanceA = await wallet.getTokenBalance(owner.address, token.address);
                console.log("Owner token A balance After Transfer", ownerAfterBalanceA.toString());

                let ownerAfterBalanceB = await wallet.getTokenBalance(owner.address, tokenB.address);
                console.log("Owner token B balance After Transfer", ownerAfterBalanceB.toString());

                // For the sake of simplicity, we will just swap 1:1, but in real scenarios, 
                // you need to integrate price feed oracles or DEXs to get real-time rates.
                await wallet.swap(tokenB.address, token.address, 50);
                console.log("Swap Successfuly");

                // tokens A after transfer
                tokenAfter = await token.balanceOf(await token.signer.getAddress())
                console.log(`Token A Balance After Swap ${tokenAfter}`);

                // tokens B after transfer
                tokenAfter = await tokenB.balanceOf(await tokenB.signer.getAddress())
                console.log(`Token B Balance After Swap ${tokenAfter}`);

                // Owner token balance after Swap
                let ownerAToken = await wallet.getTokenBalance(owner.address, token.address);
                console.log("Owner token A balance after Swap", ownerAToken.toString());

                // Owner token balance after Swap
                let ownerBToken = await wallet.getTokenBalance(owner.address, tokenB.address);
                console.log("Owner token B balance after Swap", ownerBToken.toString());

                expect(ownerAfterBalanceA.toString()).to.equal(ownerAToken.sub(50).toString());
                console.log("Token A expect complete");
                expect(ownerAfterBalanceB.toString()).to.equal(ownerBToken.add(50).toString());
                console.log("Token B expect complete");
            });
        });
    });
});