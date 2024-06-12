// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    uint8 constant Option1 = 1;
    uint8 constant Option2 = 2;

    mapping(uint8 => uint256) public votes;
    mapping(address => bool) public hasVoted;

    function vote(uint8 _option) public {
        require(_option == Option1 || _option == Option2, "Invalid option");
        require(!hasVoted[msg.sender], "You have already voted");
        votes[_option]++;
        hasVoted[msg.sender] = true;
    }

    function getWinningOption() public view returns (uint8) {
        if (votes[Option1] > votes[Option2]) {
            return Option1;
        } else if (votes[Option2] > votes[Option1]) {
            return Option2;
        } else {
            return Option1;
        }
    }

    function getTotalVotes(uint8 _option) public view returns (uint256) {
        require(_option == Option1 || _option == Option2, "Invalid option");
        return votes[_option];
    }
}
