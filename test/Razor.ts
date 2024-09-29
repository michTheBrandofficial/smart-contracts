import "@nomicfoundation/hardhat-ethers";
import { expect } from "chai";
import { Razor } from "../typechain-types";

declare global {
  namespace Mocha {
    interface Suite {
      minterAddress: string;
      recipientAddress: string;
      recipientAddress2: string;
      razor: Razor;
    }
  }
}

describe("Razor", async function () {
  before(async () => {
    const [
      { address: minterAddress },
      { address: recipientAddress },
      { address: recipientAddress2 },
    ] = await ethers.getSigners();
    const Razor = await ethers.getContractFactory("Razor");
    const razor = await Razor.deploy();
    await razor.waitForDeployment();
    await razor.issue(minterAddress, 5000);
    this.razor = razor;
    this.minterAddress = minterAddress;
    this.recipientAddress = recipientAddress;
    this.recipientAddress2 = recipientAddress2;
  });
  it("Should transfer 700 tokens from minterAddress to recipientAddress", async () => {
    const { razor, minterAddress, recipientAddress } = this;
    await razor.transfer(minterAddress, recipientAddress, 700);
    const addressBalances = [
      await razor.getBalance(minterAddress),
      await razor.getBalance(recipientAddress),
    ] as const;
    expect(addressBalances).to.eql([BigInt(4300), BigInt(700)]);
  });
  it("Should revert with InsufficientBalance when transferring more than balance", async () => {
    const { razor, minterAddress, recipientAddress } = this;
    await expect(
      razor.transfer(minterAddress, recipientAddress, 7000)
    ).to.be.revertedWithCustomError(razor, "InsufficientBalance");
  });
  it("Should revert with AmountGreaterThanSupply", async () => {
    const { razor, recipientAddress2 } = this;
    await expect(
      razor.issue(recipientAddress2, 96_000)
    ).to.be.revertedWithCustomError(razor, "AmountGreaterThanSupply");
  });
  it("Should issue 95_000 to recipientAddress2", async () => {
    const { razor, recipientAddress2 } = this;
    await razor.issue(recipientAddress2, 95_000)
    expect(await razor.getBalance(recipientAddress2)).to.equal(95_000);
  });
  it("Should revert with ExceededTotalSupply", async () => {
    const { razor, recipientAddress2 } = this;
    await expect(
      razor.issue(recipientAddress2, 100)
    ).to.be.revertedWithCustomError(razor, "ExceededTotalSupply");
  });
});
