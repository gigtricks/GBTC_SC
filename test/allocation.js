var
    PrivateSale = artifacts.require("./PrivateSale.sol"),
    TestGig = artifacts.require("./test/TestGig.sol"),
    TokenAllocation = artifacts.require("./TokenAllocation.sol"),

    Utils = require("./utils"),
    BigNumber = require('bignumber.js'),

    precision = new BigNumber("1000000000000000000"),
    privateSaleSince = parseInt(new Date().getTime() / 1000 - 3600),
    privateSaleTill = parseInt(new Date().getTime() / 1000) + 3600,
    icoSince = parseInt(new Date().getTime() / 1000 + 4600),
    icoTill = parseInt(new Date().getTime() / 1000) + 8 * 3600,
    signAddress = web3.eth.accounts[0],
    etherHolder = web3.eth.accounts[5],
    wrongSigAddress = web3.eth.accounts[7]

async function deploy() {
    const token = await TestGig.new(false);
    const privateSale = await PrivateSale.new(
        token.address, //_token,
        etherHolder,// _etherHolder,
        privateSaleSince, //_startTime
        privateSaleTill,//_endTime
        new BigNumber('14000000000000000000000000').valueOf(),
        150000000
    )
    await token.addMinter(privateSale.address);
    await token.setPrivateSale(privateSale.address);
    await privateSale.setAllowedMultivest(signAddress);
    const allocation = await TokenAllocation.new();

    return {token, privateSale, allocation};
}
contract('Allocation', function (accounts) {
    it("deploy & check constructor info", async function () {
        const {token, privateSale, allocation} = await deploy();
        console.log(allocation.address);

        await Utils.checkState({token, privateSale, allocation}, {
            token: {
                privateSale: privateSale.address,
                transferFrozen: false,
                standard: 'GBTC 0.1',
                maxSupply: new BigNumber('1000000000').mul(precision).valueOf(),
                minters: [
                    {[accounts[0]]: true},
                    {[accounts[1]]: false},
                ],
                // disableMinting: false,
                decimals: 18,
                name: 'GigBit',
                symbol: 'GBTC',
                locked: false,
                balanceOf: [
                    {[accounts[0]]: new BigNumber('0').mul(precision).valueOf()},
                    {[accounts[1]]: new BigNumber('0').mul(precision).valueOf()},
                    {["0xd339D9aeDFFa244E09874D65290c09d64b2356E0".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x26d6EF95A51BF0A2048Def4Fb7c548c3BDE37410".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x3D458b6f9024CDD9A2a7528c2E6451DD3b29e4cc".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x00dEaFC5959Dd0E164bB00D06B08d972A276bf8E".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x31b17e7a2F86d878429C03f3916d17555C0d4884".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x27B5cb71ff083Bd6a34764fBf82700b3669137f3".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x92Db818bF10Bf3BfB73942bbB1f184274aA63833".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                ],
                totalSupply: new BigNumber('0').mul(precision).valueOf(),
                owner: accounts[0]
            },
            allocation: {
                ecosystemIncentive: "0xd339D9aeDFFa244E09874D65290c09d64b2356E0".toLowerCase(),
                marketingAndBounty: "0x26d6EF95A51BF0A2048Def4Fb7c548c3BDE37410".toLowerCase(),
                liquidityFund: "0x3D458b6f9024CDD9A2a7528c2E6451DD3b29e4cc".toLowerCase(),
                treasure: "0x00dEaFC5959Dd0E164bB00D06B08d972A276bf8E".toLowerCase(),
                amirShaikh: "0x31b17e7a2F86d878429C03f3916d17555C0d4884".toLowerCase(),
                sadiqHameed: "0x27B5cb71ff083Bd6a34764fBf82700b3669137f3".toLowerCase(),
                omairLatif: "0x92Db818bF10Bf3BfB73942bbB1f184274aA63833".toLowerCase(),
                icoEndTime: 0,

                vestingApplicature: "0x0000000000000000000000000000000000000000",
                vestingSimonCocking: "0x0000000000000000000000000000000000000000",
                vestingNathanChristian: "0x0000000000000000000000000000000000000000",
                vestingEdwinVanBerg: "0x0000000000000000000000000000000000000000",
            }
        });
    })
    it("check that initVesting could be called only once", async function () {
        const {token, privateSale, allocation} = await deploy();
        allocation.initVesting({from:accounts[2]})
    .then(Utils.receiptShouldFailed)
            .catch(Utils.catchReceiptShouldFailed);
        allocation.initVesting({from:accounts[0]})
        allocation.initVesting({from:accounts[0]})
            .then(Utils.receiptShouldFailed)
            .catch(Utils.catchReceiptShouldFailed);
        await Utils.checkState({token, privateSale, allocation}, {
            token: {
                privateSale: privateSale.address,
                transferFrozen: false,
                standard: 'GBTC 0.1',
                maxSupply: new BigNumber('1000000000').mul(precision).valueOf(),
                minters: [
                    {[accounts[0]]: true},
                    {[accounts[1]]: false},
                ],
                // disableMinting: false,
                decimals: 18,
                name: 'GigBit',
                symbol: 'GBTC',
                locked: false,
                balanceOf: [
                    {[accounts[0]]: new BigNumber('0').mul(precision).valueOf()},
                    {[accounts[1]]: new BigNumber('0').mul(precision).valueOf()},
                    {["0xd339D9aeDFFa244E09874D65290c09d64b2356E0".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x26d6EF95A51BF0A2048Def4Fb7c548c3BDE37410".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x3D458b6f9024CDD9A2a7528c2E6451DD3b29e4cc".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x00dEaFC5959Dd0E164bB00D06B08d972A276bf8E".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x31b17e7a2F86d878429C03f3916d17555C0d4884".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x27B5cb71ff083Bd6a34764fBf82700b3669137f3".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                    {["0x92Db818bF10Bf3BfB73942bbB1f184274aA63833".toLowerCase()]: new BigNumber('0').mul(precision).valueOf()},
                ],
                totalSupply: new BigNumber('0').mul(precision).valueOf(),
                owner: accounts[0]
            },
            allocation: {
                ecosystemIncentive: "0xd339D9aeDFFa244E09874D65290c09d64b2356E0".toLowerCase(),
                marketingAndBounty: "0x26d6EF95A51BF0A2048Def4Fb7c548c3BDE37410".toLowerCase(),
                liquidityFund: "0x3D458b6f9024CDD9A2a7528c2E6451DD3b29e4cc".toLowerCase(),
                treasure: "0x00dEaFC5959Dd0E164bB00D06B08d972A276bf8E".toLowerCase(),
                amirShaikh: "0x31b17e7a2F86d878429C03f3916d17555C0d4884".toLowerCase(),
                sadiqHameed: "0x27B5cb71ff083Bd6a34764fBf82700b3669137f3".toLowerCase(),
                omairLatif: "0x92Db818bF10Bf3BfB73942bbB1f184274aA63833".toLowerCase(),
                icoEndTime: 0
            }
        });
    })
    it("check that after creation & initVesting, allocate - all balances are filled (owners, funds, team)", async function () {
        const {token, privateSale, allocation} = await deploy();
        allocation.initVesting({from:accounts[0]})
        allocation.allocate(token.address)
    })
    it("check that after creation & initVesting, allocate - subsequent calls of `allocate` should fail", async function () {
    })
    it("check that created vesting has correctly inited variables (equal what was send to createVesting)", async function () {
    })
    it("check that METHODS could be called only by owner", async function () {
    })
});