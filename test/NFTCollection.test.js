const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTCollection", function () {
    const NAME = "MyNFT";
    const SYMBOL = "MNFT";
    const MAX_SUPPLY = 3;
    const BASE_URI = "https://example.com/metadata/";

    async function deployFixture() {
        const [owner, user1, user2] = await ethers.getSigners();
        const NFTCollection = await ethers.getContractFactory("NFTCollection");
        const nft = await NFTCollection.deploy(NAME, SYMBOL, MAX_SUPPLY, BASE_URI);
        await nft.waitForDeployment();
        return { nft, owner, user1, user2 };
    }

    it("initializes with correct config", async function () {
        const { nft } = await deployFixture();
        expect(await nft.name()).to.equal(NAME);
        expect(await nft.symbol()).to.equal(SYMBOL);
        expect(await nft.maxSupply()).to.equal(MAX_SUPPLY);
        expect(await nft.totalSupply()).to.equal(0);
    });

    it("only owner can mint", async function () {
        const { nft, user1 } = await deployFixture();
        await expect(nft.connect(user1).mint(user1.address))
            .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("mints token and updates balances and totalSupply", async function () {
        const { nft, owner, user1 } = await deployFixture();

        await nft.mint(user1.address);

        expect(await nft.totalSupply()).to.equal(1);
        expect(await nft.balanceOf(user1.address)).to.equal(1);
        expect(await nft.ownerOf(1)).to.equal(user1.address);
    });

    it("prevents minting to zero address", async function () {
        const { nft } = await deployFixture();
        await expect(nft.mint(ethers.ZeroAddress))
            .to.be.revertedWith("Cannot mint to zero address");
    });

    it("prevents minting beyond max supply", async function () {
        const { nft, owner } = await deployFixture();

        await nft.mint(owner.address);
        await nft.mint(owner.address);
        await nft.mint(owner.address);

        await expect(nft.mint(owner.address))
            .to.be.revertedWith("Max supply reached");
    });

    it("supports transfers and updates balances", async function () {
        const { nft, owner, user1, user2 } = await deployFixture();

        await nft.mint(user1.address);

        await nft.connect(user1).transferFrom(user1.address, user2.address, 1);

        expect(await nft.ownerOf(1)).to.equal(user2.address);
        expect(await nft.balanceOf(user1.address)).to.equal(0);
        expect(await nft.balanceOf(user2.address)).to.equal(1);
    });

    it("emits events on transfer and approval", async function () {
        const { nft, owner, user1, user2 } = await deployFixture();

        await expect(nft.mint(user1.address))
            .to.emit(nft, "Transfer")
            .withArgs(ethers.ZeroAddress, user1.address, 1);

        await expect(nft.connect(user1).approve(user2.address, 1))
            .to.emit(nft, "Approval")
            .withArgs(user1.address, user2.address, 1);
    });

    it("allows burn by owner or approved and updates totalSupply", async function () {
        const { nft, user1 } = await deployFixture();

        await nft.mint(user1.address);
        expect(await nft.totalSupply()).to.equal(1);

        await nft.connect(user1).burn(1);
        expect(await nft.totalSupply()).to.equal(0);
        await expect(nft.ownerOf(1)).to.be.reverted; // token no longer exists
    });

    it("pauses transfers and minting when paused", async function () {
        const { nft, owner, user1 } = await deployFixture();

        await nft.pause();
        await expect(nft.mint(user1.address)).to.be.reverted;
        // depending on OZ version

        await nft.unpause();
        await nft.mint(user1.address);

        await nft.pause();
        await expect(
            nft.connect(user1).transferFrom(user1.address, owner.address, 1)
        ).to.be.reverted;
    });

    it("returns correct tokenURI", async function () {
        const { nft, owner } = await deployFixture();

        await nft.mint(owner.address);

        const uri = await nft.tokenURI(1);
        expect(uri).to.equal(BASE_URI + "1");
    });

    it("reverts tokenURI for non-existent token", async function () {
        const { nft } = await deployFixture();
        await expect(nft.tokenURI(999)).to.be.reverted;
    });
});
