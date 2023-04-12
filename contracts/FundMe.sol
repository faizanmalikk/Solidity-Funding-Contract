//SPDX-License-Identifier: MIT
import "hardhat/console.sol";

pragma solidity ^0.8.7;
import "./PriceConverter.sol";

error FundMe__NotOwner();

/**
 * @title Crowd Funding
 * @author Faizan Malik
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 10 * 1e18;
    address[] private s_funders;

    mapping(address => uint256) private s_addressToAmountFunded;

    address private immutable i_owner;
    AggregatorV3Interface private s_priceFeed;

    modifier OnlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }

        _;
    }

    constructor(address s_priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    // fallback() external payable {
    //     Fund();
    // }

    // receive() external payable {
    //     Fund();
    // }

    function Fund() public payable {
        require(
            msg.value.GetConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Your amount should be atleast 10 USD"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public OnlyOwner {
        address[] memory funders = s_funders;

        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        //call
        (bool callSucess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSucess, "Transaction Failed");
    }

    function GetOwner() public view returns (address) {
        return i_owner;
    }

    function GetFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function GetAddressToAmoutFunded(
        address funder
    ) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function GetPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
