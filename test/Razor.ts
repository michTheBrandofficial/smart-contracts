import "@nomicfoundation/hardhat-ethers";
import { expect } from 'chai';
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
    this.razor = razor;
    this.minterAddress = minterAddress;
    this.recipientAddress = recipientAddress;
    this.recipientAddress2 = recipientAddress2;
  });
  it("Should issue 500 tokens to first recipient", async () => {
    const { razor, recipientAddress } = this;
    await razor.issue(recipientAddress, 500);
    expect(await razor.getBalance(recipientAddress)).to.equal(500)
  });
  it("Should add 500 more tokens to first recipient", async () => {
    const { razor, recipientAddress } = this;
    await razor.issue(recipientAddress, 500);
    expect(await razor.getBalance(recipientAddress)).to.equal(1000)
  });
  it("Should issue 99_000 tokens to second recipient", async () => {
    const { razor, recipientAddress2 } = this;
    await razor.issue(recipientAddress2, 99_000);
    expect(await razor.getBalance(recipientAddress2)).to.equal(99_000)
  });
  it("Should revert with CustomError", async () => {
    const { razor, recipientAddress2 } = this;
    await expect(razor.issue(recipientAddress2, 1)).to.be.revertedWithCustomError(razor, 'ExceededTotalSupply');
  });
});
