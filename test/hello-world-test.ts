import { ethers } from "hardhat";
import { expect } from "chai";

describe("HelloWorld", function () {
  it("Should return the initial message and allow updates", async function () {

    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const initialMessage = "Hello, World!";
    const helloWorld = await HelloWorld.deploy(initialMessage);

    expect(await helloWorld.message()).to.equal(initialMessage);

    const newMessage = "Hello, Ethereum!";
    const tx = await helloWorld.updateMessage(newMessage);
    await tx.wait();

    const appendedMessage = " Appended this";
    const tx2 = await helloWorld.appendMessage(appendedMessage);
    await tx2.wait();

    expect(await helloWorld.message()).to.equal(newMessage + appendedMessage);
  });
});
