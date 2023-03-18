// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import "./IAuthenticator.sol";

contract AuthenticatorModifier {
    IAuthenticator private _authenticator;

    constructor(address authenticator) {
        _authenticator = IAuthenticator(authenticator);
    }

    modifier onlyAdmin() {
        require(_authenticator.isAdmin(msg.sender), "Not an admin");
        _;
    }

    modifier onlyCardContract() {
        require(
            _authenticator.isCardContract(msg.sender),
            "Not a card contract"
        );
        _;
    }
}
