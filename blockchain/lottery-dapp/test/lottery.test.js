const Lottery = artifacts.require("Lottery");
const { shouldThrow, expectEvent } = require("./utils");

// user1, user2, ... 에 ganache의 accounts가 순서대로 들어옴
contract("Lottery", function ([deployer, user1, user2]) {
    let lottery;
    const betAmount = 5 * 10 ** 15;
    const betAmountBN = new web3.utils.BN("5000000000000000"); // https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html#bn
    const betBlockInterval = 3;
    beforeEach(async () => {
        lottery = await Lottery.new();
    });

    it("getPot should return current pod", async () => {
        let pot = await lottery.getPot();
        assert.equal(pot, 0);
    });

    describe("Bet", function () {
        it("should fail when the bet money is not 0.005 ETH", async () => {
            await shouldThrow(lottery.bet("0xab", { from: user1, value: 1 }));
        });

        it("1 bet test", async () => {
            const challenges = "0xab";
            const receipt = await lottery.bet(challenges, { from: user1, value: betAmount });

            const pot = await lottery.getPot();
            assert.equal(pot, 0);

            const contractBalance = await web3.eth.getBalance(lottery.address);
            assert.equal(contractBalance, betAmount);

            const currentBlockNumber = await web3.eth.getBlockNumber();
            const bet = await lottery.getBetInfo(0);
            assert.equal(bet.answerBlockNumber, currentBlockNumber + betBlockInterval);
            assert.equal(bet.gambler, user1);
            assert.equal(bet.challenges, challenges);

            await expectEvent(receipt.logs, "BET");
        });
    });

    describe("isMatch test", function () {
        const blockHash = "0xae906e3732be528ee07cdeb69e4d5834a3c72936138a4b26cf4c6478c89e71e7";

        it("should be BettingResult.Win when two characters match", async () => {
            const matchingResult = await lottery.isMatch("0xae", blockHash);
            assert.equal(matchingResult, 0);
        });

        it("should be BettingResult.Fail when two characters no match", async () => {
            const matchingResult = await lottery.isMatch("0xcc", blockHash);
            assert.equal(matchingResult, 1);
        });

        it("should be BettingResult.Draw when one character match", async () => {
            let matchingResult = await lottery.isMatch("0xab", blockHash);
            assert.equal(matchingResult, 2);

            matchingResult = await lottery.isMatch("0xbe", blockHash);
            assert.equal(matchingResult, 2);
        });
    });

    describe("Distribute test", function () {
        describe("When the answer is checkable", function () {
            it("should give the user the pot money when the answer matches", async () => {
                await lottery.setAnswerForTest(
                    "0xae906e3732be528ee07cdeb69e4d5834a3c72936138a4b26cf4c6478c89e71e7",
                    { from: deployer }
                );

                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block1 FAIL
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block2 FAIL
                await lottery.betAndDistribute("0xae", { from: user1, value: betAmount }); // block3 WIN
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block4
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block5
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block6

                let potBefore = await lottery.getPot(); // == 0.01 eth
                let userBalaceBefore = await web3.eth.getBalance(user1);

                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // block7 (user1의 베팅 정답이 나오는 블록)

                let potAfter = await lottery.getPot();
                let userBalaceAfter = await web3.eth.getBalance(user1);

                assert.equal(potBefore.toString(), betAmountBN.add(betAmountBN).toString());
                assert.equal(potAfter.toString(), new web3.utils.BN("0").toString());
                assert.equal(
                    new web3.utils.BN(userBalaceBefore).add(potBefore).add(betAmountBN).toString(),
                    new web3.utils.BN(userBalaceAfter).toString()
                );
            });

            it("should give the user the bet money when a single character matches", async () => {
                await lottery.setAnswerForTest(
                    "0xae906e3732be528ee07cdeb69e4d5834a3c72936138a4b26cf4c6478c89e71e7",
                    { from: deployer }
                );

                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block1 FAIL
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block2 FAIL
                await lottery.betAndDistribute("0xaf", { from: user1, value: betAmount }); // block3 DRAW
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block4
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block5
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block6

                let potBefore = await lottery.getPot(); // == 0.01 eth
                let userBalaceBefore = await web3.eth.getBalance(user1);

                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // block7 (user1의 베팅 정답이 나오는 블록)

                let potAfter = await lottery.getPot();
                let userBalaceAfter = await web3.eth.getBalance(user1);

                assert.equal(potBefore.toString(), betAmountBN.add(betAmountBN).toString());
                assert.equal(potAfter.toString(), betAmountBN.add(betAmountBN).toString());
                assert.equal(
                    new web3.utils.BN(userBalaceBefore).add(betAmountBN).toString(),
                    new web3.utils.BN(userBalaceAfter).toString()
                );
            });

            it("should get the eth of user when the answer is not match at all", async () => {
                await lottery.setAnswerForTest(
                    "0xae906e3732be528ee07cdeb69e4d5834a3c72936138a4b26cf4c6478c89e71e7",
                    { from: deployer }
                );

                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block1 FAIL
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block2 FAIL
                await lottery.betAndDistribute("0xef", { from: user1, value: betAmount }); // block3 FAIL
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block4
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block5
                await lottery.betAndDistribute("0xef", { from: user2, value: betAmount }); // block6

                let potBefore = await lottery.getPot(); // == 0.01 eth
                let userBalaceBefore = await web3.eth.getBalance(user1);

                await lottery.betAndDistribute("0xef", {
                    from: user2,
                    value: betAmount,
                }); // block7 (user1의 베팅 정답이 나오는 블록)

                let potAfter = await lottery.getPot();
                let userBalaceAfter = await web3.eth.getBalance(user1);

                assert.equal(potBefore.toString(), betAmountBN.add(betAmountBN).toString());
                assert.equal(
                    potAfter.toString(),
                    betAmountBN.add(betAmountBN).add(betAmountBN).toString()
                );
                assert.equal(
                    new web3.utils.BN(userBalaceBefore).toString(),
                    new web3.utils.BN(userBalaceAfter).toString()
                );
            });
        });

        describe("When the answer is not revealed(Block Not Mined)", function () {});

        describe("When the answer is not revealed(Block limit is passed)", function () {});
    });
});
