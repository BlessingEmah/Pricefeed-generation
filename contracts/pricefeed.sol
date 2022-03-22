// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./IERC20.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;

    uint8 decimals;
    uint256 swapIndex = 1;
    int256 currentRate;
    address internal usdtAddress = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    address internal InchAddress = 0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f;

    struct swapInfo {
        bool swapStatus;
        address owner;
        uint8 currentDecimal;
        uint256 amountIn;
    }

    mapping(uint256 => swapInfo) swapNum;

    IERC20 USDT = IERC20(usdtAddress);
    IERC20 INCH = IERC20(InchAddress);

    constructor(address feedAddress) {
        priceFeed = AggregatorV3Interface(feedAddress);
    }

    function getLatestPrice() public {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        currentRate = price;
        decimals = priceFeed.decimals();
    }

    function getRate() public view returns (int256, uint8) {
        return (currentRate, decimals);
    }

    function swapInchToUsdt(
        address _from,
        address _to,
        uint256 _amount
    ) public {
        uint256 swapAmount = (_amount * uint256(currentRate)) / 10**decimals;
        require(INCH.balanceOf(_from) >= swapAmount, "Insufficient funds");

        swapInfo storage Order = swapNum[swapIndex];
        Order.amountIn = _amount;
        Order.currentDecimal = decimals;
        Order.owner = _from;
        ++swapIndex;
        bool status = INCH.transferFrom(_from, msg.sender, _amount);
        require(status, "transaction failed");
        bool status1 = USDT.transfer(_to, swapAmount);
        require(status1, "transaction failed");
    }

    function getOrder() public view returns (swapInfo memory) {
        swapInfo storage Order = swapNum[1];
        return (Order);
    }
}
