// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract NFTCollection is ERC721, Ownable, Pausable {
    uint256 public maxSupply;
    uint256 public totalSupply;
    string private _baseTokenURI;
    uint256 private _nextTokenId;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        string memory baseURI_
    ) ERC721(name_, symbol_) {
        require(maxSupply_ > 0, "Max supply must be > 0");
        maxSupply = maxSupply_;
        _baseTokenURI = baseURI_;
        _nextTokenId = 1;
        totalSupply = 0;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function mint(address to) external onlyOwner whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply < maxSupply, "Max supply reached");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        totalSupply++;
        _safeMint(to, tokenId);
    }

    function burn(uint256 tokenId) external whenNotPaused {
        require(_isApprovedOrOwner(msg.sender, tokenId), "Not owner nor approved");
        totalSupply--;
        _burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
