# How Admins Can Update Configuration On-Chain

## Quick Summary

Admins have **3 ways** to update Quilvion protocol parameters on-chain:

| Method | Best For | Ease |
|--------|----------|------|
| **Shell Script** | CLI users | ⭐⭐⭐⭐⭐ Easiest |
| **Sui CLI** | Advanced users | ⭐⭐⭐ Moderate |
| **TypeScript** | Developers/dApps | ⭐⭐ Complex |

---

## Method 1: Shell Script (Easiest) ⭐⭐⭐⭐⭐

### Setup

```bash
# Make script executable
chmod +x update-config.sh

# Verify Sui CLI is installed
sui --version

# Switch to Sui Testnet
sui client switch --env testnet
```

### Usage Examples

```bash
# Update platform fee to 3%
./update-config.sh fee 300

# Update daily spend limit to 2,000 USDC
./update-config.sh daily-spend 2000

# Update approval threshold to 1,000 USDC
./update-config.sh approval-threshold 1000

# Update dispute window to 14 days
./update-config.sh dispute-window 14

# Update verification expiry to 2 years
./update-config.sh verification-expiry 2

# Query current configuration
./update-config.sh query

# Show available presets
./update-config.sh presets
```

### Features

✓ Interactive confirmation prompts  
✓ Input validation  
✓ Color-coded output  
✓ Automatic gas budget handling  
✓ Network verification  
✓ Wallet verification  

---

## Method 2: Sui CLI (Standard)

### Platform Fee (2.5% → 3%)

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_platform_fee \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    300 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Daily Spend Limit (1,000 → 2,000 USDC)

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_daily_spend_limit \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    2000000000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Admin Approval Threshold (500 → 1,000 USDC)

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_admin_approval_threshold \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    1000000000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Dispute Window (7 → 14 days)

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_refund_window \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    1209600 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Merchant Verification Expiry (1 → 2 years)

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_verification_expiry \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    63072000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

---

## Method 3: TypeScript (Programmatic)

### Basic Setup

```typescript
import { Transaction } from '@mysten/sui/transactions';
import { buildSetPlatformFee, CONFIG_PRESETS } from '@/lib/sui/configTransactions';

// Create transaction
const tx = new Transaction();

// Update to 3% fee
buildSetPlatformFee(tx, 300);

// Or use preset
buildSetPlatformFee(tx, CONFIG_PRESETS.platformFee.MEDIUM);
```

### All Available Functions

```typescript
import {
  buildSetPlatformFee,
  buildSetAdminApprovalThreshold,
  buildSetDailySpendLimit,
  buildSetRefundWindow,
  buildSetVerificationExpiry,
  CONFIG_PRESETS,
  usdcToMicro,
  daysToSeconds,
  describeConfig,
} from '@/lib/sui/configTransactions';

// Platform Fee
buildSetPlatformFee(tx, CONFIG_PRESETS.platformFee.MEDIUM); // 3%

// Daily Spend
buildSetDailySpendLimit(tx, usdcToMicro(2000)); // 2,000 USDC

// Approval Threshold
buildSetAdminApprovalThreshold(tx, usdcToMicro(1000)); // 1,000 USDC

// Dispute Window
buildSetRefundWindow(tx, daysToSeconds(14)); // 14 days

// Verification Expiry
buildSetVerificationExpiry(tx, 63072000); // 2 years
```

---

## Understanding the Parameters

### Platform Fee

**Current:** 2.5% (250 basis points)  
**What it does:** Deducted from every successful order settlement and accumulated in treasury  
**Example:** 150 USDC order → 3.75 USDC fee, 146.25 USDC to merchant

**Setting values:**
- 100 = 1%
- 250 = 2.5% (default)
- 300 = 3%
- 500 = 5%
- 10,000 = 100% (max)

---

### Admin Approval Threshold

**Current:** 500 USDC (500,000,000 micro-units)  
**What it does:** Orders above this amount require admin `release_escrow` call before settlement  
**Example:** 150 USDC order auto-settles; 600 USDC order needs admin approval

**Setting values (in USDC):**
- 100 = very strict (most orders need approval)
- 500 = standard (default)
- 1,000 = moderate
- 5,000 = permissive (only very large orders need approval)

---

### Daily Spend Limit

**Current:** 1,000 USDC per wallet per 24 hours  
**What it does:** Prevents any single wallet from spending more than this in 24 hours  
**Example:** If limit is 1,000 USDC, a wallet can't create orders totaling more than 1,000 USDC in 24 hours

**Setting values (in USDC):**
- 100 = very restrictive
- 500 = conservative
- 1,000 = standard (default)
- 5,000 = generous
- 1,000,000 = effectively unlimited

---

### Dispute Refund Window

**Current:** 7 days (604,800 seconds)  
**What it does:** Time period during which buyers can raise disputes after order creation  
**Example:** With 7-day window, a buyer has 7 days to raise a dispute; after that, they can't

**Setting values (in days):**
- 1 = tight window
- 3 = short window
- 7 = standard (default)
- 14 = generous
- 30 = extended

---

### Merchant Verification Expiry

**Current:** 1 year (31,536,000 seconds)  
**What it does:** Duration for which a merchant's verification badge remains valid  
**Example:** Merchant verified on Jan 1, 2026 → badge expires on Jan 1, 2027

**Setting values (in years):**
- 0.5 = 6 months
- 1 = standard (default)
- 2 = long-term
- 3 = very long-term

---

## Converting Units

### USDC → Micro-USDC (6 decimals)

| USDC | Formula | Micro-USDC |
|------|---------|-----------|
| 1 | 1 × 1,000,000 | 1,000,000 |
| 10 | 10 × 1,000,000 | 10,000,000 |
| 100 | 100 × 1,000,000 | 100,000,000 |
| 500 | 500 × 1,000,000 | 500,000,000 |
| 1,000 | 1,000 × 1,000,000 | 1,000,000,000 |

### Days → Seconds

| Days | Formula | Seconds |
|------|---------|---------|
| 1 | 1 × 86,400 | 86,400 |
| 3 | 3 × 86,400 | 259,200 |
| 7 | 7 × 86,400 | 604,800 |
| 14 | 14 × 86,400 | 1,209,600 |
| 30 | 30 × 86,400 | 2,592,000 |

### Years → Seconds

| Years | Formula | Seconds |
|-------|---------|---------|
| 0.5 | 0.5 × 31,536,000 | 15,768,000 |
| 1 | 1 × 31,536,000 | 31,536,000 |
| 2 | 2 × 31,536,000 | 63,072,000 |
| 3 | 3 × 31,536,000 | 94,608,000 |

---

## Verification After Update

### Check Transaction Status

```bash
# View transaction
sui client transaction <TX_DIGEST>

# View on explorer
# https://suiscan.xyz/testnet/tx/<TX_DIGEST>
```

### Query Updated Configuration

```bash
# View ConfigManager object
sui client object 0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb
```

### Via Admin Dashboard

Navigate to **Admin Panel → Config Tab** to see all current parameters

---

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `ENotAuthorized` | Wallet lacks ADMIN_ROLE | Verify wallet has admin role |
| `Insufficient gas` | Gas budget too low | Increase to 20,000,000 |
| `Invalid argument` | Wrong parameter format | Check conversion tables |
| `Object not found` | Wrong object ID | Verify IDs match testnet |
| `Network error` | Not on testnet | Run `sui client switch --env testnet` |

---

## File Structure

```
quilvion-multichain-testnet/
├── update-config.sh                          # Shell script (easiest)
├── CONFIG_UPDATE_GUIDE.md                    # Detailed CLI reference
├── ADMIN_CONFIG_QUICKSTART.md               # Quick start guide
├── quilvion-sui-frontend/
│   └── src/lib/sui/
│       └── configTransactions.ts            # TypeScript helper functions
└── quilvion_sui/
    └── README.md                            # Protocol documentation
```

---

## Next Steps

1. **For CLI Users:** Use `update-config.sh` for easiest updates
2. **For Advanced Users:** Use Sui CLI commands directly
3. **For Developers:** Use TypeScript helpers in frontend/dApps
4. **For Verification:** Check Admin Dashboard Config tab

---

## Support

- **Questions?** See [CONFIG_UPDATE_GUIDE.md](./CONFIG_UPDATE_GUIDE.md) for detailed reference
- **Quick examples?** See [ADMIN_CONFIG_QUICKSTART.md](./ADMIN_CONFIG_QUICKSTART.md)
- **Protocol docs?** See [quilvion_sui/README.md](./quilvion_sui/README.md)
- **TypeScript usage?** See [src/lib/sui/configTransactions.ts](./quilvion-sui-frontend/src/lib/sui/configTransactions.ts)

---

*Quilvion Protocol — Admin Configuration Guide v1.0*  
*Last Updated: May 28, 2026*
