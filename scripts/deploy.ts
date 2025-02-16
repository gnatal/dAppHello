import { ethers } from "hardhat";

async function main() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const initialMessage = "Hello, World!";
  console.log("Deploying HelloWorld with message:", initialMessage);

  const helloWorld = await HelloWorld.deploy(initialMessage);
  // In ethers v6, the deployed contract instance is ready to use immediately.
  console.log("HelloWorld deployed to:", helloWorld.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
