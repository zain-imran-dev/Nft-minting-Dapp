const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MyNFTModule", (m) => {
  // Deploy the MyNFT contract
  const myNFT = m.contract("MyNFT", ["MyAwesomeNFT", "MANFT"]);

  return { myNFT };
});