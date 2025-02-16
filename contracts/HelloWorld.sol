pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;

    constructor(string memory _initialMessage) {
        message = _initialMessage;
    }

    function updateMessage(string memory _newMessage) public {
        message = _newMessage;
    }
}
