const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT Contract", function () {
    let myNFT;
    let owner;
    let addr1;
    let addr2;
    
    const NAME = "MyAwesomeNFT";
    const SYMBOL = "MANFT";
    const MINT_PRICE = ethers.parseEther("0.01");
    const TOKEN_URI = "https://gateway.pinata.cloud/ipfs/QmYourHashHere";
    
    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        
        const MyNFT = await ethers.getContractFactory("MyNFT");
        myNFT = await MyNFT.deploy(NAME, SYMBOL);
        await myNFT.waitForDeployment();
    });
    
    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await myNFT.name()).to.equal(NAME);
            expect(await myNFT.symbol()).to.equal(SYMBOL);
        });
        
        it("Should set the correct owner", async function () {
            expect(await myNFT.owner()).to.equal(owner.address);
        });
        
        it("Should have correct initial values", async function () {
            expect(await myNFT.mintPrice()).to.equal(MINT_PRICE);
            expect(await myNFT.maxSupply()).to.equal(1000);
            expect(await myNFT.getCurrentTokenId()).to.equal(0);
        });
    });
    
    describe("Minting", function () {
        it("Should mint NFT with correct payment", async function () {
            await expect(
                myNFT.connect(addr1).mintNFT(addr1.address, TOKEN_URI, {
                    value: MINT_PRICE
                })
            ).to.emit(myNFT, "NFTMinted")
            .withArgs(addr1.address, 0, TOKEN_URI);
            
            expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
            expect(await myNFT.tokenURI(0)).to.equal(TOKEN_URI);
            expect(await myNFT.balanceOf(addr1.address)).to.equal(1);
        });
        
        it("Should fail with insufficient payment", async function () {
            await expect(
                myNFT.connect(addr1).mintNFT(addr1.address, TOKEN_URI, {
                    value: ethers.parseEther("0.005")
                })
            ).to.be.revertedWith("Insufficient payment");
        });
        
        it("Should allow owner to mint for free", async function () {
            await expect(
                myNFT.ownerMint(addr1.address, TOKEN_URI)
            ).to.emit(myNFT, "NFTMinted");
            
            expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
        });
    });
    
    describe("Utility Functions", function () {
        beforeEach(async function () {
            // Mint some NFTs for testing
            await myNFT.connect(addr1).mintNFT(addr1.address, TOKEN_URI, {
                value: MINT_PRICE
            });
            await myNFT.connect(addr1).mintNFT(addr1.address, TOKEN_URI, {
                value: MINT_PRICE
            });
        });
        
        it("Should return correct tokens by owner", async function () {
            const tokens = await myNFT.getTokensByOwner(addr1.address);
            expect(tokens.length).to.equal(2);
            expect(tokens[0]).to.equal(0);
            expect(tokens[1]).to.equal(1);
        });
        
        it("Should return correct total supply", async function () {
            expect(await myNFT.totalSupply()).to.equal(2);
        });
    });
    
    describe("Owner Functions", function () {
        it("Should allow owner to update mint price", async function () {
            const newPrice = ethers.parseEther("0.02");
            await expect(myNFT.updateMintPrice(newPrice))
                .to.emit(myNFT, "MintPriceUpdated")
                .withArgs(newPrice);
            
            expect(await myNFT.mintPrice()).to.equal(newPrice);
        });
        
        it("Should allow owner to withdraw funds", async function () {
            // First mint to add funds
            await myNFT.connect(addr1).mintNFT(addr1.address, TOKEN_URI, {
                value: MINT_PRICE
            });
            
            const initialBalance = await ethers.provider.getBalance(owner.address);
            const tx = await myNFT.withdraw();
            const receipt = await tx.wait();
            const gasUsed = receipt.gasUsed * receipt.gasPrice;
            
            const finalBalance = await ethers.provider.getBalance(owner.address);
            expect(finalBalance).to.equal(initialBalance + MINT_PRICE - gasUsed);
        });
    });
});