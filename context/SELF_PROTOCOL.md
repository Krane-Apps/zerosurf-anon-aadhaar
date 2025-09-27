### Hackathon Details
About
Self Protocol is a privacy-first, open-source identity protocol powered by zero-knowledge proofs. It allows developers to verify users’ identity and humanity (including sybil resistance, age, country, and sanctions checks) without exposing private data.
Prizes
🏆 Best Self onchain SDK Integration ⸺ $9,000
🥇
1st place
$5,000
🥈
2nd place
$2,500
🥉
3rd place
$1,500
We are looking for interesting use cases of using the Self onchain SDK in your contracts.
Self Smart contracts verify proofs, manage a merkle tree of identity commitments and allow for onchain disclosure of data while guaranteeing the permissionless aspect of the protocol.
Using the Self.xyz SDK, allows a user to disclose their country, age (or range), that they are not on OFAC or from a sanctioned country, and verify that proof that onchain on the Celo network, or offchain, without sharing any private information with third parties.
Since this month, you can not only prove your identity with your passport or ID, but Self has just launched Aadhaar card support, and we want to see your best use cases!
Qualification Requirements
To be eligible, projects must:
- implement Self onchain SDK (right now only on Celo mainnet and testnet)
- proof needs to work

# Using mock passports

To create a mock passport, on the first screen, tap 5 times with one finger on the Self icon.

<figure><img src="https://3083267457-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F3b7SjmW8sq7ARi9xvk7J%2Fuploads%2F3wieVdidz8ZX2gtTNtxx%2Fmock-document.png?alt=media&#x26;token=c536a844-b4c3-49b9-bb16-f962c69b009c" alt="" width="188"><figcaption></figcaption></figure>

This will show a screen to create a mock passport. To try it out, use <https://playground.staging.self.xyz/> instead of <https://playground.self.xyz/>

When using offchain verification, pass `mockPassport` to the Self verifier as explained [here](https://docs.self.xyz/use-self/broken-reference).

When using onchain verification, use the Sepolia contracts [deployed-contracts](https://docs.self.xyz/contract-integration/deployed-contracts "mention").

To stop using a mock passport, Go to the settings, Select **Manage ID Documents.**

<figure><img src="https://3083267457-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F3b7SjmW8sq7ARi9xvk7J%2Fuploads%2FaEvo84gOZ57OXpWlroAV%2FManage-Id-Documents.png?alt=media&#x26;token=6db1696a-c7cb-48ab-972f-e0e6bbce2dcd" alt="" width="188"><figcaption></figcaption></figure>

Click **Scan New ID Document** or **Add Aadhar.**

<figure><img src="https://3083267457-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F3b7SjmW8sq7ARi9xvk7J%2Fuploads%2FzJz00odoj2PesiFNkHwj%2Fadd-document.png?alt=media&#x26;token=3ebf0cc7-5a9b-4aca-b47b-1aeeb6706fd3" alt="" width="188"><figcaption></figcaption></figure>

If the document is already registered, it can be selected from the Home page.

<figure><img src="https://3083267457-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F3b7SjmW8sq7ARi9xvk7J%2Fuploads%2FatYmQ2hATQQBj5QZ210Q%2FSelect-Document.png?alt=media&#x26;token=2425df16-98ff-4f68-afc9-272be7db5b72" alt="" width="188"><figcaption></figcaption></figure>

{% hint style="info" %}
Two passports registered with the same private key will give the same disclosure nullifier, thus won't be able to e.g. claim an airdrop twice.

If you want to use two passports in prod, you should backup your seed phrase then tap "Delete keychain secrets" before loading a new passport. If later you rescan the previous passport, you'll be able to pass your recovery phrase to recover the corresponding Self identity.

The next versions will support multiple IDs natively.
{% endhint %}


# Use deeplinking

Deep links allow users to open the Self mobile app directly instead of scanning QR codes. This provides a better mobile experience by eliminating the need to scan codes on the same device.

## When to Use Deep Links

* **Mobile web applications**: Users can tap a button to open Self app
* **Same-device verification**: Avoid QR code scanning on mobile
* **Messaging platforms**: Share verification links via SMS, email, or chat
* **Native mobile apps**: Direct integration with mobile applications

## Basic Usage

Generate a deep link from your SelfApp configuration:

```javascript
import { getUniversalLink } from '@selfxyz/core';
import { SelfAppBuilder } from '@selfxyz/qrcode';

// Create your SelfApp (same as for QR codes)
const selfApp = new SelfAppBuilder({
  // ... your configuration
}).build();

// Generate the deep link
const deeplink = getUniversalLink(selfApp);

// Use the deep link
window.open(deeplink, '_blank'); // Opens Self app
```

## Implementation Examples

### Simple Button

```javascript
function OpenSelfButton() {
  const handleOpenSelf = () => {
    const deeplink = getUniversalLink(selfApp);
    window.open(deeplink, '_blank');
  };

  return (
    <button onClick={handleOpenSelf}>
      Open Self App
    </button>
  );
}
```

### Mobile-First Experience

```javascript
function VerificationOptions() {
  const [deeplink, setDeeplink] = useState('');
  
  useEffect(() => {
    if (selfApp) {
      setDeeplink(getUniversalLink(selfApp));
    }
  }, [selfApp]);

  return (
    <div>
      {/* Show deep link button on mobile */}
      <div className="md:hidden">
        <button onClick={() => window.open(deeplink, '_blank')}>
          Open Self App
        </button>
      </div>
      
      {/* Show QR code on desktop */}
      <div className="hidden md:block">
        <SelfQRcodeWrapper selfApp={selfApp} />
      </div>
    </div>
  );
}
```

## Platform Considerations

### Mobile Browsers

* **iOS Safari**: Deep links work reliably
* **Android Chrome**: Deep links work reliably
* **In-app browsers**: May have limitations

### Desktop Browsers

* Deep links will attempt to open the mobile app
* If app not installed, may show app store page
* Generally better to show QR codes on desktop

## Best Practices

* **Provide both options**: Offer both QR codes and deep links
* **Mobile-first**: Prioritize deep links on mobile devices
* **Clear labeling**: Make it obvious what the button does
* **Testing**: Test on various mobile browsers and devices

# Basic Integration

{% hint style="danger" %}
**Troubleshooting Celo Sepolia**: If you encounter a `Chain 11142220 not supported` error when deploying to Celo Sepolia, try to update Foundry to version 0.3.0:

```bash
foundryup --install 0.3.0
```

{% endhint %}

## Overview

The `@selfxyz/contracts` SDK provides you with a `SelfVerificationRoot` abstract contract that wires your contract to the Identity Verification Hub V2. Your contract receives a callback with disclosed, verified attributes only after the proof succeeds.

### Key flow

1. Your contract exposes `verifySelfProof(bytes proofPayload, bytes userContextData)` from the abstract contract.
2. It takes a verification config from your contract and forwards a packed input to Hub V2.
3. If the proof is valid, the Hub calls back your contract’s `onVerificationSuccess(bytes output, bytes userData)` .
4. You implement custom logic in `customVerificationHook(...)`.

## SelfVerificationRoot

This is an abstract contract that you must override by providing custom logic for returning a config id along with a hook that is called with the disclosed attributes. Here's what you need to override:

### 1. `getConfigId`

```solidity
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view virtual override returns (bytes32) 
```

Return the **verification config ID** that the hub should enforce for this request. In simple cases, you may store a single config ID in storage and return it. In advanced cases, compute a dynamic config id based on the inputs.

**Example (static config):**

```solidity
bytes32 public verificationConfigId;

function getConfigId(
    bytes32, bytes32, bytes memory
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

### 2. `customVerificationHook`

```solidity
function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory userData
) internal virtual override
```

This is called **after** hub verification succeeds. Use it to:

* Mark the user as verified
* Mint/allowlist/gate features
* Emit events or write your own structs

## Constructor & Scope

```solidity
constructor(
    address hubV2, 
    string memory scopeSeed
) SelfVerificationRoot(hubV2, scopeSeed) {}
```

`SelfVerificationRoot` computes a **scope** at deploy time:

* It Poseidon‑hashes the **contract address** (chunked) with your **`scopeSeed`** to produce a unique `uint256` scope.
* The hub enforces that **submitted proofs match this scope**.

Why scope matters:

* Prevents cross‑contract proof replay.
* Allow anonymity between different applications as the nullifier is calculated as a function of the scope.

**Guidelines**

* Keep `scopeSeed` short (≤31 ASCII bytes). Example: `"proof-of-human"`.
* **Changing contract address changes the scope** (by design). Re‑deploys will need a fresh frontend config.
* You can read the current scope on‑chain via `function scope() public view returns (uint256)`.

{% hint style="info" %}
You can get the hub addresses from [deployed-contracts](https://docs.self.xyz/contract-integration/deployed-contracts "mention")
{% endhint %}

## Setting Verification Configs

A verification config is simply what you want to verify your user against. Your contract must reference a **verification config** that the hub recognizes. Typical steps:

1. **Format and register** the config off‑chain or in a setup contract:

```solidity
SelfStructs.VerificationConfigV2 public verificationConfig;
bytes32 public verificationConfigId;

constructor(
    address hubV2, 
    string memory scopeSeed, 
    SelfUtils.UnformattedVerificationConfigV2 memory rawCfg
) SelfVerificationRoot(hubV2, scopeSeed) {
    // 1) Format the human‑readable struct into the on‑chain wire format
    verificationConfig = SelfUtils.formatVerificationConfigV2(rawCfg);

    // 2) Register the config in the Hub. **This call RETURNS the configId.**
    verificationConfigId = IIdentityVerificationHubV2(hubV2).setVerificationConfigV2(verificationConfig);
}
```

2. **Return the config id** from `getConfigId(...)` (static or dynamic):

```solidity
function getConfigId(
    bytes32, 
    bytes32, 
    bytes memory
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

Here's how you would create a raw config:

```solidity
import { SelfUtils } from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";

//inside your contract
string[] memory forbiddenCountries = new string[](1);
  forbiddenCountries[0] = CountryCodes.UNITED_STATES;
  SelfUtils.UnformattedVerificationConfigV2 memory verificationConfig = SelfUtils.UnformattedVerificationConfigV2({
    olderThan: 18,
    forbiddenCountries: forbiddenCountries,
    ofacEnabled: false
});

```

{% hint style="warning" %}
Only a maximum of 40 countries are allowed!
{% endhint %}

### Frontend ↔ Contract config must match

{% hint style="danger" %}
The **frontend disclosure/verification config** used to produce the proof must **exactly match** the **contract’s verification config** (the `configId` you return). Otherwise the hub will detect a **mismatch** and verification fails.
{% endhint %}

Common pitfalls:

* Frontend uses `minimumAge: 18` but contract config expects `21` .
* Frontend uses different **scope** (e.g., points to a different contract address or uses a different `scopeSeed`).

{% hint style="success" %}
**Best practice:** Generate the config **once**, register it with the hub to get `configId`, and reference that same id in your dApp’s builder payload.
{% endhint %}

## Minimal Example: Proof Of Human

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";

/**
 * @title ProofOfHuman
 * @notice Test implementation of SelfVerificationRoot for the docs
 * @dev This contract provides a concrete implementation of the abstract SelfVerificationRoot
 */
contract ProofOfHuman is SelfVerificationRoot {
    // Storage for testing purposes
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;

    // Events for testing
    event VerificationCompleted(
        ISelfVerificationRoot.GenericDiscloseOutputV2 output,
        bytes userData
    );

    /**
     * @notice Constructor for the test contract
     * @param identityVerificationHubV2Address The address of the Identity Verification Hub V2
     */
    constructor(
        address identityVerificationHubV2Address,
        uint256 scopeSeed,
        SelfUtils.UnformattedVerificationConfigV2 memory _verificationConfig
    ) SelfVerificationRoot(identityVerificationHubV2Address, scopeSeed) {
        verificationConfig = 
            SelfUtils.formatVerificationConfigV2(_verificationConfig);
        verificationConfigId = 
            IIdentityVerificationHubV2(identityVerificationHubV2Address)
            .setVerificationConfigV2(verificationConfig);
    }
    
    /**
     * @notice Implementation of customVerificationHook for testing
     * @dev This function is called by onVerificationSuccess after hub address validation
     * @param output The verification output from the hub
     * @param userData The user data passed through verification
     */
    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        emit VerificationCompleted(output, userData);
    }

    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }
}
```

# Deployed Contracts

Deployment addresses for the Self protocol, on Celo mainnet and testnet.

### Celo mainnet — Real passports

<table><thead><tr><th width="374">Contract</th><th>Deployment address</th><th data-hidden></th></tr></thead><tbody><tr><td>IdentityVerificationHub</td><td><a href="https://celoscan.io/address/0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF">0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF</a></td><td></td></tr></tbody></table>

### Celo Testnet — Mock passports

<table><thead><tr><th width="374">Contract</th><th>Deployment address</th><th data-hidden></th></tr></thead><tbody><tr><td>IdentityVerificationHub</td><td><a href="https://celo-sepolia.blockscout.com/address/0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74">0x16ECBA51e18a4a7e61fdC417f0d47AFEeDfbed74</a></td><td></td></tr></tbody></table>

# Airdrop Example

This example demonstrates V2 contract integration using the [Airdrop contract](https://github.com/selfxyz/self/blob/main/contracts/contracts/example/Airdrop.sol), which supports both E-Passport and EU ID Card verification with registration/claim phases and Merkle tree token distribution.

### Airdrop-Specific Features

This contract demonstrates:

* **Two-phase distribution:** Registration → Claim separation
* **Merkle tree allocation:** Fair token distribution
* **Multi-document registration:** Both E-Passport and EU ID cards supported
* **Anti-duplicate measures:** Nullifier and user identifier tracking

### Registration Logic

The registration phase validates user eligibility and prevents duplicate registrations:

**Key Validations:**

* Registration phase must be open
* Nullifier hasn't been used (prevents same document registering twice)
* Valid user identifier provided
* User identifier hasn't already registered (prevents address reuse)

### State Variables

```solidity
/// @notice Maps nullifiers to user identifiers for registration tracking
mapping(uint256 nullifier => uint256 userIdentifier) internal _nullifierToUserIdentifier;

/// @notice Maps user identifiers to registration status
mapping(uint256 userIdentifier => bool registered) internal _registeredUserIdentifiers;

/// @notice Tracks addresses that have claimed tokens
mapping(address => bool) public claimed;

/// @notice ERC20 token to be airdropped
IERC20 public immutable token;

/// @notice Merkle root for claim validation
bytes32 public merkleRoot;

/// @notice Phase control
bool public isRegistrationOpen;
bool public isClaimOpen;

/// @notice Verification config ID for identity verification
bytes32 public verificationConfigId;
```

For standard V2 integration patterns (constructor, getConfigId), see [Basic Integration Guide](https://docs.self.xyz/contract-integration/broken-reference).

**Registration Verification Hook:**

```solidity
function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory /* userData */
) internal override {
    // Airdrop-specific validations
    if (!isRegistrationOpen) revert RegistrationNotOpen();
    if (_nullifierToUserIdentifier[output.nullifier] != 0) revert RegisteredNullifier();
    if (output.userIdentifier == 0) revert InvalidUserIdentifier();
    if (_registeredUserIdentifiers[output.userIdentifier]) revert UserIdentifierAlreadyRegistered();

    // Register user for airdrop
    _nullifierToUserIdentifier[output.nullifier] = output.userIdentifier;
    _registeredUserIdentifiers[output.userIdentifier] = true;
    
    emit UserIdentifierRegistered(output.userIdentifier, output.nullifier);
}
```

### Claim Function Implementation

```solidity
function claim(uint256 index, uint256 amount, bytes32[] memory merkleProof) external {
    if (isRegistrationOpen) {
        revert RegistrationNotClosed();
    }
    if (!isClaimOpen) {
        revert ClaimNotOpen();
    }
    if (claimed[msg.sender]) {
        revert AlreadyClaimed();
    }
    if (!_registeredUserIdentifiers[uint256(uint160(msg.sender))]) {
        revert NotRegistered(msg.sender);
    }

    // Verify the Merkle proof
    bytes32 node = keccak256(abi.encodePacked(index, msg.sender, amount));
    if (!MerkleProof.verify(merkleProof, merkleRoot, node)) revert InvalidProof();

    // Mark as claimed and transfer tokens
    claimed[msg.sender] = true;
    token.safeTransfer(msg.sender, amount);

    emit Claimed(index, msg.sender, amount);
}
```

### Configuration Management

The contract includes methods for managing verification configuration:

```solidity
// Set verification config ID
function setConfigId(bytes32 configId) external onlyOwner {
    verificationConfigId = configId;
}

// Override to provide configId for verification
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

### Administrative Functions

```solidity
// Set Merkle root for claim validation
function setMerkleRoot(bytes32 newMerkleRoot) external onlyOwner;

// Update verification scope
function setScope(uint256 newScope) external onlyOwner;

// Phase control
function openRegistration() external onlyOwner;
function closeRegistration() external onlyOwner;
function openClaim() external onlyOwner;
function closeClaim() external onlyOwner;
```

### Airdrop Flow

1. **Deploy:** Owner deploys with hub address, scope, and token
2. **Configure:** Set verification config ID and Merkle root using `setConfigId()` and `setMerkleRoot()`
3. **Open Registration:** Users prove identity to register
4. **Close Registration:** Move to claim phase
5. **Open Claims:** Registered users claim via Merkle proofs
6. **Distribution Complete:** Tokens distributed to verified users

For verification configuration setup, see [Hub Verification Process](https://docs.self.xyz/technical-docs/verification-in-the-identityverificationhub#v2-enhanced-verifications).

## Related Documentation

* [Basic Integration Guide](https://docs.self.xyz/contract-integration/broken-reference) - Core V2 integration patterns
* [Hub Verification Process](https://docs.self.xyz/technical-docs/verification-in-the-identityverificationhub) - Verification configuration
* [Identity Attributes](https://docs.self.xyz/contract-integration/broken-reference) - Working with verified data
* [Happy Birthday Example](https://docs.self.xyz/contract-integration/happy-birthday-example) - Date-based verification example

# Happy Birthday Example

This example demonstrates the V2 [Happy Birthday contract](https://github.com/selfxyz/self/blob/main/contracts/contracts/example/HappyBirthday.sol) that distributes USDC to users on their birthday, with document type bonuses and support for both E-Passport and EU ID Card verification.

## Birthday-Specific Features

* **Birthday Window Validation:** Configurable time window around user's birthday
* **Document Type Bonuses:** Different reward multipliers for E-Passport vs EU ID cards
* **Date Processing:** Simplified handling of pre-extracted V2 date attributes
* **One-time Claims:** Nullifier prevents multiple birthday claims

For standard V2 integration patterns, see [Basic Integration Guide](https://docs.self.xyz/contract-integration/broken-reference).

### State Variables

```solidity
/// @notice USDC token contract
IERC20 public immutable usdc;

/// @notice Default: 50 USDC (6 decimals)
uint256 public claimableAmount = 50e6;

/// @notice Bonus multiplier for EU ID card users (in basis points)
uint256 public euidBonusMultiplier = 200; // 200% = 2x bonus

/// @notice Bonus multiplier for E-Passport users (in basis points) 
uint256 public passportBonusMultiplier = 150; // 150% = 1.5x bonus

/// @notice Birthday claim window (default: 1 day)
uint256 public claimableWindow = 1 days;

/// @notice Tracks users who have claimed to prevent double claims
mapping(uint256 nullifier => bool hasClaimed) public hasClaimed;

/// @notice Verification config ID for identity verification
bytes32 public verificationConfigId;

uint256 public constant BASIS_POINTS = 10000;
```

### Birthday Verification Logic

The core birthday validation uses V2's pre-extracted date format:

**Birthday Verification Hook:**

```solidity
function customVerificationHook(
    ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
    bytes memory /* userData */
) internal override {
    // Birthday-specific validations
    if (hasClaimed[output.nullifier]) revert AlreadyClaimed();
    if (!_isWithinBirthdayWindow(output.attestationId, output.dateOfBirth)) {
        revert NotWithinBirthdayWindow();
    }

    // Calculate bonus based on document type
    uint256 finalAmount = claimableAmount;
    if (output.attestationId == AttestationId.EU_ID_CARD) {
        finalAmount = (claimableAmount * euidBonusMultiplier) / BASIS_POINTS;
    } else if (output.attestationId == AttestationId.E_PASSPORT) {
        finalAmount = (claimableAmount * passportBonusMultiplier) / BASIS_POINTS;
    }

    // Process birthday claim
    hasClaimed[output.nullifier] = true;
    address recipient = address(uint160(output.userIdentifier));
    usdc.safeTransfer(recipient, finalAmount);
    
    emit USDCClaimed(recipient, finalAmount, output.attestationId);
}
```

### V2 Simplified Birthday Verification

The V2 implementation dramatically simplifies birthday verification by using pre-extracted date attributes:

```solidity
function _isWithinBirthdayWindow(
    bytes32 attestationId, 
    string memory dobFromProof
) internal view returns (bool) {
    // DOB comes in format "DD-MM-YY" from the V2 proof system
    bytes memory dobBytes = bytes(dobFromProof);
    require(dobBytes.length == 8, "Invalid DOB format"); // "DD-MM-YY" = 8 chars

    // Extract day and month from "DD-MM-YY" format
    string memory day = Formatter.substring(dobFromProof, 0, 2);   // DD
    string memory month = Formatter.substring(dobFromProof, 3, 5); // MM (skip hyphen)

    // Create birthday in current year (format: YYMMDD)
    string memory dobInThisYear = string(abi.encodePacked("25", month, day));
    uint256 dobInThisYearTimestamp = Formatter.dateToUnixTimestamp(dobInThisYear);

    uint256 currentTime = block.timestamp;
    uint256 timeDifference;

    if (currentTime > dobInThisYearTimestamp) {
        timeDifference = currentTime - dobInThisYearTimestamp;
    } else {
        timeDifference = dobInThisYearTimestamp - currentTime;
    }

    return timeDifference <= claimableWindow;
}
```

### Document Type Bonuses

The V2 implementation provides different bonuses based on document type:

```solidity
// EU ID Card users get 2x bonus
if (output.attestationId == AttestationId.EU_ID_CARD) {
    finalAmount = (claimableAmount * 200) / 10000; // 200% = 2x
}
// E-Passport users get 1.5x bonus  
else if (output.attestationId == AttestationId.E_PASSPORT) {
    finalAmount = (claimableAmount * 150) / 10000; // 150% = 1.5x
}
```

### Administrative Functions

```solidity
// Update claimable amount
function setClaimableAmount(uint256 newAmount) external onlyOwner {
    uint256 oldAmount = claimableAmount;
    claimableAmount = newAmount;
    emit ClaimableAmountUpdated(oldAmount, newAmount);
}

// Update birthday claim window
function setClaimableWindow(uint256 newWindow) external onlyOwner {
    uint256 oldWindow = claimableWindow;
    claimableWindow = newWindow;
    emit ClaimableWindowUpdated(oldWindow, newWindow);
}

// Update EU ID bonus multiplier
function setEuidBonusMultiplier(uint256 newMultiplier) external onlyOwner {
    uint256 oldMultiplier = euidBonusMultiplier;
    euidBonusMultiplier = newMultiplier;
    emit EuidBonusMultiplierUpdated(oldMultiplier, newMultiplier);
}

// Set verification config ID
function setConfigId(bytes32 configId) external onlyOwner {
    verificationConfigId = configId;
}

// Withdraw USDC from contract
function withdrawUSDC(address to, uint256 amount) external onlyOwner {
    usdc.safeTransfer(to, amount);
}
```

### Birthday Contract Benefits

**V2 Date Simplification:** Direct access to `output.dateOfBirth` eliminates complex parsing **Multi-Document Rewards:** Different bonus structures for passport vs EU ID card users **Flexible Windows:** Configurable birthday claim periods **Admin Controls:** Owner can adjust amounts, windows, and bonuses

For verification configuration setup, see [Hub Verification Process](https://docs.self.xyz/technical-docs/verification-in-the-identityverificationhub#v2-enhanced-verifications).

### Configuration Management

The contract includes methods for managing verification configuration:

```solidity
// Override to provide configId for verification
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view override returns (bytes32) {
    return verificationConfigId;
}
```

### Example Usage

1. **Deploy Contract:** With hub address, scope, and USDC token address
2. **Set Configuration:** Call `setConfigId()` with your verification config ID or use `setupVerificationConfig()` pattern
3. **Fund Contract:** Transfer USDC to contract for distribution
4. **User Claims:** Users verify identity and automatically receive birthday bonus
5. **Document Bonuses:** EU ID card users get 2x, passport users get 1.5x the base amount

## Related Documentation

* [Basic Integration Guide](https://docs.self.xyz/contract-integration/broken-reference) - Core V2 integration patterns
* [Identity Attributes](https://docs.self.xyz/contract-integration/broken-reference) - Date handling and attribute access
* [Airdrop Example](https://docs.self.xyz/contract-integration/airdrop-example) - Registration-based verification example
* [Hub Verification Process](https://docs.self.xyz/technical-docs/verification-in-the-identityverificationhub) - Verification configuration

# Working with userDefinedData

The `userDefinedData` is mainly used in the frontend to allow users to pass in additional information during the time of verification.&#x20;

{% hint style="warning" %}
The `userDefinedData` passed in the QRCode gets converted from a **string** to **bytes**. You will have to convert it back from bytes to a string again and work on top of that.&#x20;
{% endhint %}

## Setting a config

When setting a config just creating the config is not enough. You should register the config with the hub and this method will also return the config id.&#x20;

```solidity
//internal map that stores from hash(data) -> configId
mapping(uint256 => uint256) public configs;

function setConfig(
    string memory configDesc, 
    SelfUtils.UnformattedVerificationConfigV2 config
) public {
    //create the key
    uint256 key = uint256(keccak256(bytes(configDesc)));
    //create the hub compliant config struct
    SelfStructs.VerificationConfigV2 verificationConfig = 
        SelfUtils.formatVerificationConfigV2(_verificationConfig);
    //register and get the id
    uint256 verificationConfigId = 
        IIdentityVerificationHubV2(identityVerificationHubV2Address)
        .setVerificationConfigV2(verificationConfig);
    //set it in the key
    configs[key] = verificationConfigId;
}
```

### Change the `getConfigId` in the `SelfVerificationRoot`

Now we just have to change the `getConfigId` that returns the config ids from this map. This is pretty simple as now we just have to hash the existing bytes:&#x20;

```solidity
function getConfigId(
    bytes32 destinationChainId,
    bytes32 userIdentifier,
    bytes memory userDefinedData
) public view virtual returns (bytes32) {
    //the string is already converted to bytes
    uint256 key = keccak256(userDefinedData);
    return configs[key];
}
```
# Aadhaar

## What is Aadhaar?&#x20;

Aadhaar is India’s national digital identity system maintained by UIDAI (Unique Identification Authority of India).&#x20;

* It is a **12-digit unique identity number** issued to residents of India, based on their biometric and demographic data.
* Aadhaar serves as a **foundational ID** that can be used to verify identity across financial, telecom, and government services.
* Verification is done via UIDAI APIs or Aadhaar-linked services, such as QR codes.

{% hint style="danger" %}
UIDAI does not sign the entire Aadhaar number and only the last 4 digits. As this does not have enough entropy to create a nullifer we also use other fields such as the name, date of birth, and gender. This also means that person can change their Aadhaar and be considered as a "new" person in the protocol. Although we have chosen fields that are hard to change edge cases do pop up such as people changing their names due to marriage, divorce or other legal corrections.&#x20;
{% endhint %}

## Registering with Aadhaar on Self

Self allows users to prove identity using Aadhaar in a **privacy-preserving** way. There are two common methods:

1. #### Using the mAadhaar app&#x20;
   1. #### Download the official **mAadhaar app** from UIDAI ([Android](https://play.google.com/store/apps/details?id=in.gov.uidai.mAadhaarPlus)/[IOS](https://apps.apple.com/in/app/maadhaar/id1435469474)).&#x20;
   2. #### Inside the app, generate a **QR code** that contains Aadhaar demographic details.

      <figure><img src="https://3083267457-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F3b7SjmW8sq7ARi9xvk7J%2Fuploads%2F13V9wjNvQFPV1sGTbzOe%2FWhatsApp%20Image%202025-09-26%20at%2000.13.52.jpeg?alt=media&#x26;token=809e6be7-ca85-4362-a3eb-484c63048ccf" alt="" width="149"><figcaption><p>mAadhaar</p></figcaption></figure>
   3. #### Upload this QR code in the Self app to register.
      1. #### Self processes this QR to derive a unique **nullifier** (an identifier) that allows users to prove uniqueness without sharing their Aadhaar number directly.
2. #### By using the UIDAI website
   1. #### Go to the [UIDAI website](https://myaadhaar.uidai.gov.in/genricDownloadAadhaar/en)
   2. #### Enter your Aadhaar number, and verify yourself with an OTP to get a PDF.&#x20;
   3. #### Take a screenshot of the QR code in the pdf and upload in the Self app.&#x20;

{% hint style="info" %}
The password to the PDF in both cases is the first four letters of your name in caps following by your birth year.
{% endhint %}

## Working with attributes in Aadhaar

Since Aadhaar uses a different format than passports, keep in mind that some of the disclosed attribute formats can be different.&#x20;

### `GenericDiscloseOutputV2`&#x20;

<table><thead><tr><th>Field </th><th>Type</th><th>Formatting / Value</th></tr></thead><tbody><tr><td><pre><code>forbiddenCountriesListPacked
</code></pre></td><td><code>uint256[4]</code></td><td>Packed bytes of all countries into an array 4 <code>uint256</code> numbers.</td></tr><tr><td><pre><code>issuingState
</code></pre></td><td><code>string</code></td><td>Varies**</td></tr><tr><td><pre><code>name
</code></pre></td><td><code>string[]</code></td><td>First value contains the entire name (and it may vary)</td></tr><tr><td><pre><code>idNumber
</code></pre></td><td><code>string</code></td><td>Last 4 letters of the aadhaar number. </td></tr><tr><td><pre><code>nationality
</code></pre></td><td><code>string</code></td><td><code>'IND'</code></td></tr><tr><td><pre><code>dateOfBirth
</code></pre></td><td><code>string</code></td><td><code>DD-MM-YYYY</code></td></tr><tr><td><pre><code>gender
</code></pre></td><td><code>string</code></td><td><code>'M' | 'T' | 'F'</code></td></tr><tr><td><pre><code>expiryDate
</code></pre></td><td><code>string</code></td><td><code>'UNAVAILBLE'</code></td></tr><tr><td><pre><code>olderThan
</code></pre></td><td><code>uint256</code></td><td><code>0 - 99</code></td></tr><tr><td><pre><code>ofac
</code></pre></td><td><code>bool[3]</code></td><td>Each value is true if ofac check is enabled.</td></tr></tbody></table>

### `GenericDiscloseOutput`

<table><thead><tr><th>Field</th><th>Type</th><th>Formatting / Value</th></tr></thead><tbody><tr><td><pre><code>forbiddenCountriesListPacked
</code></pre></td><td><code>string[]</code></td><td>Packed bytes list of forbidden countries</td></tr><tr><td><pre><code>issuingState
</code></pre></td><td><code>string</code></td><td>Varies</td></tr><tr><td><pre><code>name
</code></pre></td><td><code>string</code></td><td>Full name. Can vary as well</td></tr><tr><td><pre><code>idNumber
</code></pre></td><td><code>string</code></td><td>Last 4 digits of aadhaar</td></tr><tr><td><pre><code>nationality
</code></pre></td><td><code>string</code></td><td><code>'IND'</code></td></tr><tr><td><pre><code>dateOfBirth
</code></pre></td><td><code>string</code></td><td><code>YYYYMMDD</code></td></tr><tr><td><pre><code>gender
</code></pre></td><td><code>string</code></td><td><code>'M' | 'T' | 'F'</code></td></tr><tr><td><pre><code>expiryDate
</code></pre></td><td><code>string</code></td><td><code>'UNAVAILABLE'</code></td></tr><tr><td><pre><code>minimumAge
</code></pre></td><td><code>string</code></td><td><code>'00'-'99'</code>  </td></tr><tr><td><pre><code>ofac
</code></pre></td><td><code>bool[]</code></td><td>True if in ofac</td></tr></tbody></table>

{% hint style="info" %}
\*\*Varies refers to a string being all caps / lowercase / first letter in caps and the rest in lowercase.
{% endhint %}
