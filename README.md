**📘 NFTCollection – ERC-721 NFT Smart Contract**

This project implements a fully functional ERC-721 (NFT) smart contract with minting, burning, pausing, metadata support, ownership control, and a full automated test suite.
The entire environment is containerized using Docker, ensuring consistent builds and test execution across systems.
This project was developed using Hardhat, Solidity 0.8.20, and OpenZeppelin Contracts 4.9.3.

**🚀 Features**

🔹 ERC-721 Standard
Implements the full ERC-721 interface with safe transfers, approvals, and ownership tracking.

🔹 Owner-Only Minting
Only the contract deployer (owner) can mint new NFTs.

🔹 Max Supply Restriction
The contract enforces a fixed maximum number of NFTs.

🔹 Burn Function
Token owners or approved addresses can burn NFTs, reducing total supply.

🔹 Pause & Unpause
The contract owner can pause:
Minting
Transfers
Burning

This adds security during upgrades or emergencies.

🔹 Metadata Support
Uses a base URI + tokenId pattern to generate metadata endpoints.
Example:
```bash
https://example.com/metadata/1
```

🔹 Extensive Automated Tests
Covers:
Minting behavior
Transfers
Approvals
Burn logic
Pausing logic
Metadata
Failure scenarios
Event emission

🔹 Dockerized Testing Environment
A Dockerfile is included to run tests in a clean, reproducible environment.

**🔧 Tech Stack**

Component	Version
Solidity	0.8.20
Hardhat	2.26.0
OpenZeppelin	4.9.3
Node.js	18.x (inside Docker)
Docker	Latest

---

**🛠️ Installation & Setup**

**1️⃣ Install Dependencies**
```bash
npm install
```

**🧪 Running Tests Locally**

To run tests using Hardhat:
```bash
npx hardhat test
```

Expected output:
11 passing

**🐳 Running Tests in Docker**

**✔ 1. Build the Docker image**
```bash
```
docker build -t nft-contract .

**✔ 2. Run tests inside the container**
```bash
docker run --rm nft-contract
```


This ensures:
No dependency issues
No missing compiler downloads
Fully reproducible results
Expected output:
11 passing

**📜 Smart Contract Overview**

NFTCollection.sol

Implements:
mint(address)
burn(uint256)
pause(), unpause()
_beforeTokenTransfer() override
_baseURI() override
Supply tracking (totalSupply, maxSupply)
_isApprovedOrOwner() validation
Event emission (Transfer, Approval)

Constructor Parameters:
```bash
constructor(
    string memory name_,
    string memory symbol_,
    uint256 maxSupply_,
    string memory baseURI_
)
```

**🧪 Test Suite Overview**

Tests include:

✔ Initialization
✔ Owner-only minting
✔ Max supply checks
✔ Metadata (tokenURI)
✔ Token transfer logic
✔ Approvals + events
✔ Burn by owner or approved
✔ Reverts for invalid cases
✔ Complete pause/unpause behavior

All tests pass successfully.

**🐳 Dockerfile Explanation**

The Dockerfile:
Uses Node 18 Alpine (lightweight)
Installs project dependencies
Pre-downloads Solidity compiler
Runs tests automatically when container starts
This ensures tests run offline without needing network access.

**🎯 How to Use in CI / Submission**

```bash

docker build -t nft-contract .
docker run --rm nft-contract
```


**🏁 Conclusion**

The project fulfills all major requirements:

✔ ERC-721 compliant NFT smart contract
✔ Minting, burning, pausing, metadata
✔ Ownership + access control
✔ Full automated testing
✔ Dockerized execution
✔ Reproducible environment
✔ Clean project structure
✔ Ready for submission
