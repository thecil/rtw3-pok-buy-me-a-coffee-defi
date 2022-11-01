import { deployments, ethers, getNamedAccounts } from 'hardhat';
import { expect } from 'chai';
import { BigNumber } from 'ethers';

const setupTest = deployments.createFixture(
    async ({ deployments, getNamedAccounts, ethers }, options) => {
        await deployments.fixture(); // ensure you start from a fresh deployments
        const { deployer, signerOne, signerTwo } = await getNamedAccounts();
        const users = await ethers.getSigners();

        const contractFactory = await ethers.getContractFactory("BuyMeACoffee");
        const contract = await contractFactory.deploy();
        const BuyMeACoffee = await contract.deployed();

        return {
            tokenOwner: {
                address: deployer,
                BuyMeACoffee,
                users
            },
        };
    }
);

/**
 * 1. Check balances before the coffee purchase.
2. Buy the owner a few coffees, Check balances after the coffee purchase.
3. Withdraw, Check balances after withdrawal
4. Check out the memos.
 */

describe('BuyMeACoffee', () => {

    interface Balances {
        inEther: string,
        inBN: typeof BigNumber
    }
    
    // Returns the Ether balance of a given address.
    const getBalance = async (address: string): Promise<Balances> => {
        const balanceBigInt = await ethers.provider.getBalance(address);
        return {
            inEther: ethers.utils.formatEther(balanceBigInt),
            inBN: balanceBigInt
        };
    }
    
    const tip = { value: ethers.utils.parseEther("1") };

    it('1. Check balances before the coffee purchase.', async () => {
        const { tokenOwner } = await setupTest();
        const { deployer, tipper, tipper2, tipper3 } = await getNamedAccounts();

        const balances = {
            deployer: await getBalance(deployer),
            contract: await getBalance(tokenOwner.BuyMeACoffee.address),
            tipper: await getBalance(tipper),
            tipper2: await getBalance(tipper2),
            tipper3: await getBalance(tipper3)
        }

        for (const [k, v] of Object.entries(balances)) {
            if (k != "deployer" && k != "contract") expect(v.inEther).to.be.equal('10000.0');
        }

    });

    it('2. Buy the owner a few coffees, Check balances after the coffee purchase.', async () => {
        const { tokenOwner } = await setupTest();
        const { deployer, tipper, tipper2, tipper3 } = await getNamedAccounts();

        const getBalances = async () => {
            return {
                deployer: await getBalance(deployer),
                contract: await getBalance(tokenOwner.BuyMeACoffee.address),
                tipper: await getBalance(tipper),
                tipper2: await getBalance(tipper2),
                tipper3: await getBalance(tipper3)
            }
        }
        const beforeBalances = await getBalances();

        const signers = {
            tipper: await ethers.getSigner(tipper),
            tipper2: await ethers.getSigner(tipper2),
            tipper3: await ethers.getSigner(tipper3)
        }

        await tokenOwner.BuyMeACoffee.connect(signers.tipper).buyCoffee("Carolina", "You're the best!", tip);
        await tokenOwner.BuyMeACoffee.connect(signers.tipper2).buyCoffee("Vitto", "Amazing teacher", tip);
        await tokenOwner.BuyMeACoffee.connect(signers.tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip);

        const newBalances = await getBalances();

        for (const [k, v] of Object.entries(beforeBalances)) {
            expect(v.inBN).to.be.equal(newBalances[k].inBN.add(v.inBN.sub(newBalances[k].inBN)))
        }

    });

    it('3. Withdraw, Check balances after withdrawal', async () => {
        const { tokenOwner } = await setupTest();
        const { deployer, tipper, tipper2, tipper3 } = await getNamedAccounts();

        const getBalances = async () => {
            return {
                deployer: await getBalance(deployer),
                contract: await getBalance(tokenOwner.BuyMeACoffee.address),
                tipper: await getBalance(tipper),
                tipper2: await getBalance(tipper2),
                tipper3: await getBalance(tipper3)
            }
        }
        const beforeBalances = await getBalances();
        // console.log('before tips', beforeBalances);

        const signers = {
            tipper: await ethers.getSigner(tipper),
            tipper2: await ethers.getSigner(tipper2),
            tipper3: await ethers.getSigner(tipper3)
        }

        await tokenOwner.BuyMeACoffee.connect(signers.tipper).buyCoffee("Carolina", "You're the best!", tip);
        await tokenOwner.BuyMeACoffee.connect(signers.tipper2).buyCoffee("Vitto", "Amazing teacher", tip);
        await tokenOwner.BuyMeACoffee.connect(signers.tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip);

        const afterBalances = await getBalances();
        // console.log('after tips', afterBalances);

        for (const [k, v] of Object.entries(beforeBalances)) {
            expect(v.inBN).to.be.equal(afterBalances[k].inBN.add(v.inBN.sub(afterBalances[k].inBN)))
        }

        await tokenOwner.BuyMeACoffee.withdrawTips();

        const withDrawBalances = await getBalances();
        // console.log('after withdraw tips', withDrawBalances);

        for (const [k, v] of Object.entries(afterBalances)) {
            expect(v.inBN).to.be.equal(withDrawBalances[k].inBN.add(v.inBN.sub(withDrawBalances[k].inBN)))
        }
    });

    it('4. Check out the memos.', async () => {
        const { tokenOwner } = await setupTest();
        const { tipper, tipper2, tipper3 } = await getNamedAccounts();

        const signers = {
            tipper: await ethers.getSigner(tipper),
            tipper2: await ethers.getSigner(tipper2),
            tipper3: await ethers.getSigner(tipper3)
        }

        await tokenOwner.BuyMeACoffee.connect(signers.tipper).buyCoffee("Carolina", "You're the best!", tip);
        await tokenOwner.BuyMeACoffee.connect(signers.tipper2).buyCoffee("Vitto", "Amazing teacher", tip);
        await tokenOwner.BuyMeACoffee.connect(signers.tipper3).buyCoffee("Kay", "I love my Proof of Knowledge", tip);

        
        const memos = await tokenOwner.BuyMeACoffee.getMemos();
        expect(memos.length).to.be.equal(3);
        expect(memos[0].message).to.be.equal("You're the best!");
        expect(memos[1].message).to.be.equal("Amazing teacher");
        expect(memos[2].message).to.be.equal("I love my Proof of Knowledge");

        // console.log('memos', memos)
    });

});