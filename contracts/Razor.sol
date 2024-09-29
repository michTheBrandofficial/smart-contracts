// SPDX-License-Identifier: GPL 3.0
pragma solidity 0.8.27;
import "hardhat/console.sol";

contract Razor {
	uint32 totalSupply = 100_000;
	uint32 mintedTokens = 0;
  address minter;
	mapping (address => uint32) private balances;

  constructor() {
		minter = msg.sender;
	}

	modifier onlyMinter {
		require(
			msg.sender == minter,
			"Only the minter can mint tokens and issue to buyers."	
		);
		_;
	}

	error ExceededTotalSupply(uint32 _mintedTokens, uint32 _totalSupply);

	modifier totalSupplyNotReached {
		if (totalSupply == mintedTokens) {
			revert ExceededTotalSupply(mintedTokens, totalSupply);
		}
		_;
	}

	error AmountGreaterThanSupply(uint32 _amount, uint32 _totalSupply);

	modifier amountNotGreaterThanSupply(uint32 _amount) {
		uint32 noOfUnmintedTokens = totalSupply - mintedTokens;
		if (_amount > noOfUnmintedTokens) {
			revert AmountGreaterThanSupply(_amount, totalSupply);
		}
		_;
	}

  function mint(uint32 _amount) private onlyMinter totalSupplyNotReached amountNotGreaterThanSupply(_amount) returns (uint32) {
		mintedTokens += _amount;
		return _amount;
  }

	/**
		use this to get minted tokens from ethers
	 */
	function getMintedTokens() public view returns (uint32) {
		return mintedTokens;
	}

	function issue(address _receiver, uint32 _amount) public onlyMinter {
		uint32 _mintedAmount = mint(_amount);
		balances[_receiver] += _mintedAmount;
	}

	function getBalance(address _address) public view returns (uint32) {
		return balances[_address];
	}

	error InsufficientBalance(address _address, uint32 _balance);

	modifier hasEnoughBalance(address _address, uint32 _balance, uint32 _amount) {
		if (!(_balance >= _amount)) {
			revert InsufficientBalance(_address, _balance);
		} 
		_;
	}

	function transfer(address _sender, address _recipient, uint32 _amount) public hasEnoughBalance(_sender, balances[_sender], _amount) {
		balances[_recipient] += _amount;
		balances[_sender] -= _amount;
	}
}
