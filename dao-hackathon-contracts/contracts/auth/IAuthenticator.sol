// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IAuthenticator {
    function setAdmin(address _address) external;

    function isAdmin(address _address) external view returns (bool);

    function setCardContract(address _address) external;

    function isCardContract(address _address) external view returns (bool);
}
