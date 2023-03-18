// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CardVotes.sol";

contract Card is CardVotes, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    CardPosition private _cardPosition;

    constructor(
        string memory name,
        string memory symbol,
        address cardPosition
    ) ERC721(name, symbol) CardVotes(name, "1", cardPosition) {
        _cardPosition = CardPosition(cardPosition);
    }

    // function mint(address to, string memory _tokenUri)
    //     public
    //     returns (uint256)
    // {
    //     _tokenIds.increment();
    //     uint256 newItemId = _tokenIds.current();
    //     _mint(to, newItemId);
    //     _setTokenURI(newItemId, _tokenUri);
    //     return newItemId;
    // }

    // function mintBatch(address to, string[] memory _tokenUris)
    //     public
    //     onlyOwner
    //     returns (uint256)
    // {
    //     uint256 tokenId = this.mint(to, _tokenUris[0]);
    //     for (uint256 i = 1; i < _tokenUris.length; i++) {
    //         this.mint(to, _tokenUris[i]);
    //     }
    //     return tokenId;
    // }

    function mint(
        address to,
        string memory _tokenUri,
        Position position
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, _tokenUri);
        _cardPosition.setPosition(newItemId, position);
        return newItemId;
    }

    function transfer(address to, uint256 tokenId) public {
        transferFrom(_msgSender(), to, tokenId);
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    // Function overloads required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, CardVotes) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721, CardVotes) {
        super._afterTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(CardVotes, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, CardVotes)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
