// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FairTradeCertificate
 * @dev An NFT representing fair trade certification for companies
 */
contract FairTradeCertificate is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    // Counter for token IDs
    uint256 private _nextTokenId;
    
    // Mapping to store company information
    mapping(uint256 => CompanyInfo) private _companyInfo;
    
    // Structure to store company information
    struct CompanyInfo {
        string companyName;
        string registrationNumber;
        uint256 certificationDate;
        uint256 expirationDate;
    }
    
    // Events
    event CertificateIssued(uint256 indexed tokenId, address indexed recipient, string companyName);
    event CertificateRevoked(uint256 indexed tokenId, string reason);
    event CertificateRenewed(uint256 indexed tokenId, uint256 newExpirationDate);
    
    constructor(address initialOwner) 
        ERC721("FairTradeCertificate", "FTC") 
        Ownable(initialOwner) 
    {}
    
    /**
     * @dev Issues a new fair trade certificate to a company
     * @param to Address of the company receiving the certificate
     * @param companyName Name of the company
     * @param registrationNumber Legal registration number of the company
     * @param validityPeriod Duration of validity in days
     * @param tokenURI URI for metadata storage (IPFS link recommended)
     */
    function issueCertificate(
        address to,
        string memory companyName,
        string memory registrationNumber,
        uint256 validityPeriod,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store company information
        _companyInfo[tokenId] = CompanyInfo({
            companyName: companyName,
            registrationNumber: registrationNumber,
            certificationDate: block.timestamp,
            expirationDate: block.timestamp + (validityPeriod * 1 days)
        });
        
        emit CertificateIssued(tokenId, to, companyName);
        
        return tokenId;
    }
    
    /**
     * @dev Renews an existing certificate
     * @param tokenId ID of the token to renew
     * @param additionalPeriod Additional validity period in days
     */
    function renewCertificate(uint256 tokenId, uint256 additionalPeriod) public onlyOwner {
        require(_exists(tokenId), "Certificate does not exist");
        
        CompanyInfo storage info = _companyInfo[tokenId];
        info.expirationDate += additionalPeriod * 1 days;
        
        emit CertificateRenewed(tokenId, info.expirationDate);
    }
    
    /**
     * @dev Revokes a certificate by burning the token
     * @param tokenId ID of the token to revoke
     * @param reason Reason for revocation
     */
    function revokeCertificate(uint256 tokenId, string memory reason) public onlyOwner {
        require(_exists(tokenId), "Certificate does not exist");
        
        _burn(tokenId);
        emit CertificateRevoked(tokenId, reason);
    }
    
    /**
     * @dev Returns the company information for a given token ID
     * @param tokenId ID of the token
     */
    function getCompanyInfo(uint256 tokenId) public view returns (
        string memory companyName,
        string memory registrationNumber,
        uint256 certificationDate,
        uint256 expirationDate
    ) {
        require(_exists(tokenId), "Certificate does not exist");
        
        CompanyInfo memory info = _companyInfo[tokenId];
        return (
            info.companyName,
            info.registrationNumber,
            info.certificationDate,
            info.expirationDate
        );
    }
    
    /**
     * @dev Checks if a certificate is valid (not expired)
     * @param tokenId ID of the token
     */
    function isValid(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Certificate does not exist");
        
        return block.timestamp <= _companyInfo[tokenId].expirationDate;
    }
    
    // The following functions are overrides required by Solidity

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}