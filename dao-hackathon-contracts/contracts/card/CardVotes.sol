// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/governance/utils/Votes.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./CardPosition.sol";

abstract contract CardVotes is ERC721Votes, ERC721Enumerable {
    CardPosition private _cardPosition;

    mapping(PositionPower => uint256) private _positionPower;

    constructor(
        string memory name,
        string memory version,
        address cardPosition
    ) EIP712(name, version) {
        _cardPosition = CardPosition(cardPosition);
        _positionPower[PositionPower.Power0] = 0;
        _positionPower[PositionPower.Power10] = 10;
        _positionPower[PositionPower.Power20] = 20;
        _positionPower[PositionPower.Power30] = 30;
        _positionPower[PositionPower.Power40] = 40;
        _positionPower[PositionPower.Power50] = 50;
        _positionPower[PositionPower.Power60] = 60;
        _positionPower[PositionPower.Power70] = 70;
        _positionPower[PositionPower.Power80] = 80;
        _positionPower[PositionPower.Power90] = 90;
        _positionPower[PositionPower.Power100] = 100;
    }

    function _getVotingUnits(address account)
        internal
        view
        override
        returns (uint256)
    {
        return getVotePower(account);
    }

    function getVotePower(address account) public view returns (uint256) {
        uint256 power = getVotes(account);
        if (power == 0) {
            for (uint256 i = 0; i < balanceOf(account); i++) {
                uint256 tokenId = tokenOfOwnerByIndex(account, i);
                if (isCardVote(tokenId)) {
                    power += _positionPower[
                        _cardPosition.getCardPower(tokenId)
                    ];
                }
            }
        }
        return power;
    }

    function isCardVote(uint256 tokenId) internal view returns (bool) {
        if (_cardPosition.getPosition(tokenId) != Position.None) {
            return true;
        }
        return false;
    }

    // Function overloads required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Votes) {
        super._afterTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
