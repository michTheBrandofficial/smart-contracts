async function main() {
  const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const razor = await ethers.getContractAt("Razor", address);
  const [
    { address: firstAddr },
    { address: secondAddr },
    { address: thirdAddr },
  ] = await ethers.getSigners();
  await razor.issue(firstAddr, 7000);
  await razor.transfer(firstAddr, secondAddr, 700);
  console.log({
    firstAddrBalance: await razor.getBalance(firstAddr),
    secondAddrBalance: await razor.getBalance(secondAddr),
  });
  console.log({
    mintedTokens: await razor.getMintedTokens(),
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
