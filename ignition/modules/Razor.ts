// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const RazorModule = buildModule("RazorModule", (m) => {
  const razor = m.contract("Razor");

  return { razor };
});

export default RazorModule;
