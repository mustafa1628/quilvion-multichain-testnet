# Quilvion Admin Resources Index

Welcome! This guide helps you find the right resource for updating protocol configuration on-chain.

---

## 🚀 Quick Navigation

### I want to update configuration...

**👉 [START HERE: How to Update Configuration](./ADMIN_CONFIG_HOW_TO.md)**  
→ Shows all 3 methods (script, CLI, TypeScript) with examples

---

## 📚 All Resources

### For Shell Script Users (Easiest) ⭐⭐⭐⭐⭐

**File:** [`update-config.sh`](./update-config.sh)

Quick start:
```bash
chmod +x update-config.sh
./update-config.sh fee 300          # Set fee to 3%
./update-config.sh daily-spend 2000 # Set daily limit to 2,000 USDC
./update-config.sh query            # View current config
```

**Best for:** Non-technical admins, quick updates, interactive confirmations

---

### For CLI Users ⭐⭐⭐

**File:** [`CONFIG_UPDATE_GUIDE.md`](./CONFIG_UPDATE_GUIDE.md)

Contains:
- All 5 setter functions with examples
- Time & currency conversion tables
- Error handling guide
- Explorer links

Example:
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_platform_fee \
  --args <CONFIG_MANAGER> 300 <ROLE_MANAGER> \
  --gas-budget 10000000
```

**Best for:** Advanced users, batch operations, scripting

---

### For Developers ⭐⭐

**File:** [`quilvion-sui-frontend/src/lib/sui/configTransactions.ts`](./quilvion-sui-frontend/src/lib/sui/configTransactions.ts)

TypeScript helpers:
- `buildSetPlatformFee(tx, bps)`
- `buildSetAdminApprovalThreshold(tx, microUSDC)`
- `buildSetDailySpendLimit(tx, microUSDC)`
- `buildSetRefundWindow(tx, seconds)`
- `buildSetVerificationExpiry(tx, seconds)`
- `CONFIG_PRESETS` for quick values
- Utility functions for conversions

Example:
```typescript
import { buildSetPlatformFee, CONFIG_PRESETS } from '@/lib/sui/configTransactions';

const tx = new Transaction();
buildSetPlatformFee(tx, CONFIG_PRESETS.platformFee.MEDIUM); // 3%
```

**Best for:** Frontend dApps, custom UIs, programmatic updates

---

### For Quick Reference ⚡

**File:** [`ADMIN_CONFIG_QUICKSTART.md`](./ADMIN_CONFIG_QUICKSTART.md)

Contains:
- Quick start for each method
- Common update patterns
- React component example
- Preset values
- Verification steps

**Best for:** Learning, copying examples, reference

---

## 📋 Configuration Parameters

### Platform Fee
- **Current:** 2.5% (250 basis points)
- **Range:** 0–10,000 bps (0–100%)
- **Effect:** Deducted on settlement, accumulated in treasury
- **Update via:** `set_platform_fee`

### Admin Approval Threshold
- **Current:** 500 USDC (500,000,000 micro-units)
- **Effect:** Orders above this require admin `release_escrow` call
- **Update via:** `set_admin_approval_threshold`

### Daily Spend Limit
- **Current:** 1,000 USDC per wallet per 24 hours
- **Effect:** Prevents wallet from exceeding daily spending cap
- **Update via:** `set_daily_spend_limit`

### Dispute Refund Window
- **Current:** 7 days (604,800 seconds)
- **Effect:** Time period for buyer to raise dispute after order creation
- **Update via:** `set_refund_window`

### Merchant Verification Expiry
- **Current:** 1 year (31,536,000 seconds)
- **Effect:** Duration merchant badge remains valid
- **Update via:** `set_verification_expiry`

---

## 🔗 Related Documentation

### Protocol Overview
**File:** [`quilvion_sui/README.md`](./quilvion_sui/README.md)

Contains:
- Full protocol architecture
- All modules documentation
- Error codes
- Integration guide
- Order lifecycle
- Role system

---

### Admin Dashboard
**Location:** `/admin` route in Quilvion UI

Features:
- **Stats Tab:** Platform metrics and alerts
- **Merchants Tab:** Review & approve merchants
- **Products Tab:** Review & approve products
- **Disputes Tab:** Handle pending escrow orders
- **Config Tab:** View all current parameters

---

## 🎯 Common Tasks

### Update Platform Fee to 3%

**Via Shell Script:**
```bash
./update-config.sh fee 300
```

**Via CLI:**
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_platform_fee \
  --args 0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb 300 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

**Via TypeScript:**
```typescript
const tx = new Transaction();
buildSetPlatformFee(tx, 300);
```

---

### Update Daily Spend Limit to 2,000 USDC

**Via Shell Script:**
```bash
./update-config.sh daily-spend 2000
```

**Via CLI:**
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_daily_spend_limit \
  --args 0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb 2000000000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

**Via TypeScript:**
```typescript
const tx = new Transaction();
buildSetDailySpendLimit(tx, usdcToMicro(2000));
```

---

### Update Dispute Window to 14 Days

**Via Shell Script:**
```bash
./update-config.sh dispute-window 14
```

**Via CLI:**
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_refund_window \
  --args 0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb 1209600 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

**Via TypeScript:**
```typescript
const tx = new Transaction();
buildSetRefundWindow(tx, daysToSeconds(14));
```

---

## 📍 Constants Reference

### Package & Objects (Testnet)

| Item | Value |
|------|-------|
| Package ID | `0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4` |
| Config Manager | `0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb` |
| Role Manager | `0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea` |
| Network | Sui Testnet |

### Explorer Links

- **Package:** https://suiscan.xyz/testnet/object/0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4
- **Config:** https://suiscan.xyz/testnet/object/0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb

---

## ✅ Prerequisites

- ✓ Sui CLI installed (`sui --version`)
- ✓ Active admin wallet (`sui client active-address`)
- ✓ ADMIN_ROLE or DEFAULT_ADMIN_ROLE
- ✓ Connected to Sui Testnet (`sui client active-env`)
- ✓ Sufficient SUI for gas (~0.1 SUI per transaction)

---

## 🆘 Troubleshooting

### "ENotAuthorized" Error
→ Your wallet lacks ADMIN_ROLE  
**Solution:** Verify wallet has admin role or use correct admin wallet

### "Insufficient gas" Error
→ Gas budget too low  
**Solution:** Increase `--gas-budget` to 20,000,000 or higher

### "Object not found" Error
→ Wrong object ID  
**Solution:** Verify object IDs match testnet deployment above

### "Not on Sui Testnet" Error
→ Connected to wrong network  
**Solution:** Run `sui client switch --env testnet`

---

## 🔐 Security Notes

1. **Always verify** the transaction before confirming
2. **Use** your admin wallet exclusively for admin functions
3. **Keep** your private keys secure
4. **Double-check** parameter values before updating
5. **Monitor** transactions on explorer after updates

---

## 📞 Support

For more information:

1. **Protocol Questions?** → Read [quilvion_sui/README.md](./quilvion_sui/README.md)
2. **How to Update?** → Read [ADMIN_CONFIG_HOW_TO.md](./ADMIN_CONFIG_HOW_TO.md)
3. **CLI Reference?** → Read [CONFIG_UPDATE_GUIDE.md](./CONFIG_UPDATE_GUIDE.md)
4. **Quick Start?** → Read [ADMIN_CONFIG_QUICKSTART.md](./ADMIN_CONFIG_QUICKSTART.md)
5. **Script Help?** → Run `./update-config.sh help`

---

## 📁 File Structure

```
quilvion-multichain-testnet/
├── ADMIN_RESOURCES.md                  # You are here
├── ADMIN_CONFIG_HOW_TO.md              # Start here for how-to
├── ADMIN_CONFIG_QUICKSTART.md          # Quick reference & examples
├── CONFIG_UPDATE_GUIDE.md              # Detailed CLI guide
├── update-config.sh                    # Shell script (easiest)
├── quilvion-sui-frontend/
│   └── src/lib/sui/
│       └── configTransactions.ts       # TypeScript helpers
├── quilvion_sui/
│   └── README.md                       # Protocol documentation
└── [other directories...]
```

---

## 🎓 Learning Path

1. **New to admin role?** → Start with [ADMIN_CONFIG_HOW_TO.md](./ADMIN_CONFIG_HOW_TO.md)
2. **Prefer shell script?** → Use [`update-config.sh`](./update-config.sh)
3. **Want CLI reference?** → Study [CONFIG_UPDATE_GUIDE.md](./CONFIG_UPDATE_GUIDE.md)
4. **Building frontend?** → Use [configTransactions.ts](./quilvion-sui-frontend/src/lib/sui/configTransactions.ts)
5. **Need protocol knowledge?** → Read [quilvion_sui/README.md](./quilvion_sui/README.md)

---

*Quilvion Protocol — Admin Resources Index v1.0*  
*Last Updated: May 28, 2026*
