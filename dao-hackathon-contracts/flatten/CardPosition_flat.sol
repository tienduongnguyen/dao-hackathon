// Sources flattened with hardhat v2.13.0 https://hardhat.org

// File contracts/auth/IAuthenticator.sol

// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IAuthenticator {
    function setAdmin(address _address) external;

    function isAdmin(address _address) external view returns (bool);
}

// File contracts/auth/AuthenticatorModifier.sol

pragma solidity 0.8.9;

contract AuthenticatorModifier {
    IAuthenticator private _authenticator;

    constructor(address authenticator) {
        _authenticator = IAuthenticator(authenticator);
    }

    modifier onlyAdmin() {
        require(_authenticator.isAdmin(msg.sender), "Not an admin");
        _;
    }
}

// File contracts/enum/Position.sol

pragma solidity ^0.8.9;

enum Position {
    None,
    Employee,
    Leader,
    Manager,
    Director
}

enum PositionPower {
    Power0,
    Power10,
    Power20,
    Power30,
    Power40,
    Power50,
    Power60,
    Power70,
    Power80,
    Power90,
    Power100
}

// File contracts/card/CardPosition.sol

pragma solidity ^0.8.9;

contract CardPosition is AuthenticatorModifier {
    mapping(uint256 => Position) private _position;
    mapping(Position => PositionPower) private _power;

    constructor(address authenticator) AuthenticatorModifier(authenticator) {
        _power[Position.Employee] = PositionPower.Power20;
        _power[Position.Leader] = PositionPower.Power30;
        _power[Position.Manager] = PositionPower.Power40;
        _power[Position.Director] = PositionPower.Power50;
    }

    function getPosition(uint256 tokenId) public view returns (Position) {
        return _position[tokenId];
    }

    function setPosition(uint256 tokenId, Position position) public onlyAdmin {
        _position[tokenId] = position;
    }

    function getPositionPower(
        Position position
    ) public view returns (PositionPower) {
        return _power[position];
    }

    function setPositionPower(
        Position position,
        PositionPower power
    ) public onlyAdmin {
        _power[position] = power;
    }

    function getCardPower(uint256 tokenId) public view returns (PositionPower) {
        return _power[_position[tokenId]];
    }
}
