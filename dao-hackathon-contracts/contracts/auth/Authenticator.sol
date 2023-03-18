// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IAuthenticator.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Authenticator is IAuthenticator, Ownable {
    mapping(address => bool) private _isAdmin;
    mapping(address => bool) private _isCardContract;

    constructor() {
        _isAdmin[msg.sender] = true;
    }

    function setAdmin(address account) external override onlyOwner {
        _isAdmin[account] = true;
    }

    function isAdmin(address account) external view override returns (bool) {
        return _isAdmin[account];
    }

    function setCardContract(address account) external override onlyOwner {
        _isCardContract[account] = true;
    }

    function isCardContract(
        address account
    ) external view override returns (bool) {
        return _isCardContract[account];
    }
}
