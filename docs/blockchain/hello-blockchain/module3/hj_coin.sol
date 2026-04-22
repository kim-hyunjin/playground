// SPDX-License-Identifier: MIT 
// HJ Coin ICO

pragma solidity ^0.8.19;

contract hjcoin_ico {
    // maximum number of hjcoin available for sale
    uint public max_hjcoins = 100000;

    // usd to hjcoins conversion rate
    uint public usd_to_hjcoins = 1000;

    // total number of hjcoins that hava been bought by the investors.
    uint public total_hjcoins_bought = 0;

    // mapping from the investor address to its equity in hjcoins and usd
    mapping(address => uint) equity_hjcoins;
    mapping(address => uint) equity_usd;

    // checking if an investor can buy hjcoins
    modifier can_buy_hjcoins(uint usd_invested) {
        require(usd_invested * usd_to_hjcoins + total_hjcoins_bought <= max_hjcoins);
        _;
    }

    // getting the equity in hjcoins of an investor
    function equity_in_hjcoins(address investor) external view returns (uint) {
        return equity_hjcoins[investor];
    }

    // getting the equity in usd of an investor
    function equity_in_usd(address investor) external view returns (uint) {
        return equity_usd[investor];
    }

    // buying hjcoins
    function buy_hjcoins(address investor, uint usd_invested) external can_buy_hjcoins(usd_invested) {
        uint hjcoins_bought = usd_invested * usd_to_hjcoins;
        equity_hjcoins[investor] += hjcoins_bought;
        equity_usd[investor] += usd_invested;
        total_hjcoins_bought += hjcoins_bought;
    }

    // selling hjcoins
    // buying hjcoins
    function sell_hjcoins(address investor, uint hjcoin_sold) external {
        equity_hjcoins[investor] -= hjcoin_sold;
        equity_usd[investor] -= hjcoin_sold / usd_to_hjcoins;
        total_hjcoins_bought -= hjcoin_sold;
    }
}