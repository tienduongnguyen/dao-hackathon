// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../auth/AuthenticatorModifier.sol";
import "../enum/Position.sol";

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

    function setPosition(
        uint256 tokenId,
        Position position
    ) public onlyCardContract {
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
