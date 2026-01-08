# 🔐 Token Vault – UUPS Upgradeable Smart Contracts

This project implements an **upgradeable ERC20 token vault** using the **UUPS proxy pattern**.
It demonstrates safe contract upgrades, security best practices, and comprehensive testing
with high code coverage.

---

## 📌 Features

- ✅ UUPS Upgradeable Architecture
- ✅ Versions: V1 → V2 → V3
- ✅ Secure upgrade authorization
- ✅ Initializer & reinitializer usage
- ✅ State preserved across upgrades
- ✅ Extensive unit & security tests
- ✅ Solidity coverage report

---

## 🏗️ Contract Versions

### 🔹 TokenVaultV1
- Deposit ERC20 tokens
- Track user balances
- Owner-controlled upgrades

### 🔹 TokenVaultV2
- Preserves all V1 state
- Adds versioning logic
- Prevents reinitialization

### 🔹 TokenVaultV3
- Adds `withdraw` and `withdrawAll`
- Full backward compatibility
- Strong upgrade security enforcement

---

## 🧪 Testing

All tests are written using **Mocha + Chai** and follow strict upgrade rules.

### Run tests:
```bash
npx hardhat test
Generate coverage:
bash
Copy code
npx hardhat coverage
📊 Coverage Summary
Contract	Statements	Branches	Functions	Lines
TokenVaultV1	83%	83%	75%	88%
TokenVaultV2	100%	100%	100%	100%
TokenVaultV3	100%	75%	100%	100%
Overall	91.67%	83.33%	90.91%	93.75%

🔐 Security Practices
Uses OwnableUpgradeable

_authorizeUpgrade enforced

No constructors in upgradeable contracts

Fully qualified contract factories

Unauthorized upgrades prevented

Reinitializers protected

📁 Project Structure
text
Copy code
contracts/
 ├── TokenVaultV1.sol
 ├── TokenVaultV2.sol
 ├── TokenVaultV3.sol
 └── mocks/
     └── MockERC20.sol

test/
 ├── TokenVaultV1.test.js
 ├── TokenVaultV2.test.js
 ├── TokenVaultV3.test.js
 ├── coverage tests
 └── upgrade tests

coverage/
🚀 How to Run Locally
bash
Copy code
git clone https://github.com/Chopra-14/token-vault-uups.git
cd token-vault-uups
npm install
npx hardhat test
npx hardhat coverage
👩‍💻 Author
Chopra Lakshmi Sathvika
🔗 GitHub: https://github.com/Chopra-14

✅ Status
✔ All tests passing
✔ Coverage generated
✔ Submission ready
✔ Upgrade-safe and production-quality

