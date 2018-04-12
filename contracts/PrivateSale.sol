pragma solidity 0.4.21;


import "./SellableToken.sol";
//import "./Crowdsale.sol";


contract PrivateSale is SellableToken {

    uint256 public price;
    uint256 public discount;
    SellableToken public ico;


    function PrivateSale(
        address _token,
        address _etherHolder,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxTokenSupply,
        uint256 _etherPriceInUSD
    ) public SellableToken(
        _token,
        _etherHolder,
        _startTime,
        _endTime,
        _maxTokenSupply,
        _etherPriceInUSD
    ) {
        price = 24800;// $0.2480 * 10 ^ 5
        discount = 75;// $75%
    }

    function changeSalePeriod(uint256 _start, uint256 _end) public onlyOwner {
        if (_start != 0 && _start < _end) {
            startTime = _start;
            endTime = _end;
        }
    }

    function isActive() public view returns (bool) {
        if (soldTokens == maxTokenSupply) {
            return false;
        }

        return withinPeriod();
    }

    function withinPeriod() public view returns (bool) {
        return block.timestamp >= startTime && block.timestamp <= endTime;
    }

    function calculateTokensAmount(uint256 _value) public view returns (uint256 tokenAmount, uint256 usdAmount) {
        if (_value == 0) {
            return (0, 0);
        }

        usdAmount = _value.mul(etherPriceInUSD);
        tokenAmount = usdAmount.div(price);
        if (usdAmount < minPurchase) {
            return (0, 0);
        }
        usdAmount = usdAmount.div(uint256(10) ** 18);
        tokenAmount = tokenAmount.mul(discount).div(100)+tokenAmount;//75%
    }

    function calculateEthersAmount(uint256 _tokens) public view returns (uint256 ethers, uint256 bonus) {
        if (_tokens == 0 || _tokens < minPurchase) {
            return (0, 0);
        }

        ethers = _tokens.mul(price).div(etherPriceInUSD);
        bonus = _tokens.mul(discount).div(100)+_tokens;//75%
    }

    function getStats(uint256 _ethPerBtc) public view returns (
        uint256 start,
        uint256 end,
        uint256 sold,
        uint256 maxSupply,
        uint256 min,
        uint256 tokensPerEth,
        uint256 tokensPerBtc
    ) {
        start = startTime;
        end = endTime;
        sold = soldTokens;
        maxSupply = maxTokenSupply;
        min = minPurchase;
        uint256 usd;
        (tokensPerEth, usd) = calculateTokensAmount(1 ether);
        (tokensPerBtc, usd) = calculateTokensAmount(_ethPerBtc);
    }

    function setICO(address _ico) public onlyOwner {
        require(_ico != address(0));
        ico = SellableToken(_ico);
    }

    function moveUnsoldTokens() public onlyOwner {
        if (address(ico) != address(0) && now >= endTime && !isActive() && maxTokenSupply > soldTokens) {
            ico.setMaxTokenSupply(maxTokenSupply.sub(soldTokens));
            maxTokenSupply = soldTokens;
        }
    }

    function setMaxTokenSupply(uint256) public {
        return;
    }

    function isTransferAllowed(address, uint256) public view returns (bool status){
        return true;
    }

    function buy(address _address, uint256 _value) internal returns (bool) {
        if (_value == 0 || _address == address(0)) {
            return false;
        }

        uint256 tokenAmount;
        uint256 usdAmount;

        (tokenAmount, usdAmount) = calculateTokensAmount(_value);

        uint256 mintedAmount = mintInternal(_address, tokenAmount);
        collectedUSD = collectedUSD.add(usdAmount);
        require(usdAmount > 0 && mintedAmount > 0);

        etherHolder.transfer(this.balance);
        collectedEthers = collectedEthers.add(_value);
        etherBalances[_address] = etherBalances[_address].add(_value);
        transferEthers();
        Contribution(_address, _value, tokenAmount);
        return true;
    }

    function transferEthers() internal {
            etherHolder.transfer(this.balance);
    }
}