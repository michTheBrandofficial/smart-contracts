async function main() {
  const [
    owner,
  ] = await ethers.getSigners();
  const Razor = await ethers.getContractFactory('Razor', owner);
  const razor = await Razor.deploy();
  await razor.waitForDeployment();
  console.log("Razor token deployed to address: ", await razor.getAddress());
  console.log("By this homie: ", owner.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
