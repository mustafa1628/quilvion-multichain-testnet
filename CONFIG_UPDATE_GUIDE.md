# Quilvion Protocol — Admin On-Chain Configuration Guide

This guide explains how admins can update protocol configuration parameters directly on the Sui blockchain.

---

## Prerequisites

- **Sui CLI** installed and configured
- **Admin wallet** with ADMIN_ROLE or DEFAULT_ADMIN_ROLE
- Access to **Sui Testnet**
- Sufficient **SUI** for gas fees (~0.1 SUI per transaction)

**Network:** Sui Testnet  
**Package ID:** `0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4`  
**Config Manager Object:** `0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb`  
**Role Manager Object:** `0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea`

---

## 1. Update Platform Fee

### Current Value
- **Rate:** 2.5% (250 basis points)
- **Effect:** Deducted on every settlement

### Command

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_platform_fee \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    <NEW_BPS> \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Examples

**Set to 3% (300 basis points):**
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

**Set to 2% (200 basis points):**
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_platform_fee \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    200 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Fee Calculation Examples

For a 150 USDC order:
- At 2.5% (250 bps): `150 × 250 ÷ 10,000 = 3.75 USDC` fee
- At 3% (300 bps): `150 × 300 ÷ 10,000 = 4.5 USDC` fee
- At 2% (200 bps): `150 × 200 ÷ 10,000 = 3 USDC` fee

**Constraint:** `0 ≤ bps ≤ 10,000` (max 100%)

---

## 2. Update Admin Approval Threshold

### Current Value
- **Threshold:** 500 USDC (500,000,000 micro-units)
- **Effect:** Orders above this require admin `release_escrow` call

### Command

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_admin_approval_threshold \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    <AMOUNT_MICRO_USDC> \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Examples

**Set to 1,000 USDC (1 billion micro-units):**
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

**Set to 200 USDC (200 million micro-units):**
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_admin_approval_threshold \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    200000000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Micro-Unit Conversion
| USDC | Micro-units |
|---|---|
| 1 | 1,000,000 |
| 10 | 10,000,000 |
| 50 | 50,000,000 |
| 100 | 100,000,000 |
| 200 | 200,000,000 |
| 500 | 500,000,000 |
| 1,000 | 1,000,000,000 |
| 5,000 | 5,000,000,000 |

---

## 3. Update Daily Spend Limit

### Current Value
- **Limit:** 1,000 USDC (1 billion micro-units per wallet)
- **Duration:** 24-hour rolling window
- **Effect:** Prevents any wallet from spending more than this in 24 hours

### Command

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_daily_spend_limit \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    <AMOUNT_MICRO_USDC> \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Examples

**Set to 2,000 USDC per day (2 billion micro-units):**
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

**Set to 500 USDC per day (500 million micro-units):**
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_daily_spend_limit \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    500000000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

---

## 4. Update Dispute Refund Window

### Current Value
- **Window:** 7 days (604,800 seconds)
- **Effect:** Buyers can only raise disputes within this window after order creation

### Command

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_refund_window \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    <SECONDS> \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Examples

**Set to 14 days (1,209,600 seconds):**
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

**Set to 3 days (259,200 seconds):**
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_refund_window \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    259200 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Time Conversion Reference
| Duration | Seconds |
|---|---|
| 1 hour | 3,600 |
| 1 day | 86,400 |
| 2 days | 172,800 |
| 3 days | 259,200 |
| 7 days | 604,800 |
| 14 days | 1,209,600 |
| 30 days | 2,592,000 |

---

## 5. Update Merchant Verification Expiry

### Current Value
- **Expiry:** 1 year (31,536,000 seconds)
- **Effect:** Duration for which a merchant verification badge remains valid

### Command

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_verification_expiry \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    <SECONDS> \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Examples

**Set to 2 years (63,072,000 seconds):**
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

**Set to 6 months (15,768,000 seconds):**
```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module config_manager \
  --function set_verification_expiry \
  --args \
    0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb \
    15768000 \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
  --gas-budget 10000000
```

### Time Conversion Reference
| Duration | Seconds |
|---|---|
| 1 month | 2,592,000 |
| 3 months | 7,776,000 |
| 6 months | 15,768,000 |
| 1 year | 31,536,000 |
| 2 years | 63,072,000 |
| 3 years | 94,608,000 |

---

## Batch Configuration Update

To update multiple parameters in a single transaction, you can chain commands. However, each setter function must be called separately as they modify state on-chain.

### Recommended Process

1. **Platform Fee** → `set_platform_fee`
2. **Approval Threshold** → `set_admin_approval_threshold`
3. **Daily Spend Limit** → `set_daily_spend_limit`
4. **Dispute Window** → `set_refund_window`
5. **Verification Expiry** → `set_verification_expiry`

Execute in sequence, waiting for each transaction to complete before moving to the next.

---

## Verifying Configuration Changes

### View Current Config

Query the `ConfigManager` object to verify changes:

```bash
sui client object 0xbc97b93da570249a5d0e8d1df257b8eea7325dfcd12f6245effc4b541f9f77eb
```

This returns the current configuration state stored on-chain.

### Via Admin API (Quilvion Backend)

```bash
curl -H "x-admin-secret: quilvion-admin-2025" \
  http://localhost:8000/api/admin/config
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|---|---|---|
| `ENotAuthorized` | Caller lacks ADMIN_ROLE | Verify wallet has admin role; use correct admin wallet |
| `EInvalidBasisPoints` | Fee BPS > 10,000 | Ensure fee is ≤ 10,000 (≤ 100%) |
| `Insufficient gas` | Gas budget too low | Increase `--gas-budget` to 20,000,000+ |
| `Object not found` | Wrong object ID | Verify object IDs match testnet deployment |

### Check Admin Role

Verify your wallet has ADMIN_ROLE:

```bash
sui client call \
  --package 0xb6ee5d919c1ea7a727b9d86af1bc9259b4f68584b9feb03432f545f5a384a2c4 \
  --module access_control \
  --function is_admin \
  --args \
    0x54b04b6cd74f63dccdcdd2b8ca4092f7a7685d485bf7f9fcd31745323c7d6eea \
    <YOUR_WALLET_ADDRESS> \
  --gas-budget 5000000
```

---

## Quick Reference Table

| Parameter | Function | Default | Unit |
|---|---|---|---|
| Platform Fee | `set_platform_fee` | 250 | basis points (0-10,000) |
| Approval Threshold | `set_admin_approval_threshold` | 500,000,000 | micro-USDC |
| Daily Spend Limit | `set_daily_spend_limit` | 1,000,000,000 | micro-USDC |
| Dispute Window | `set_refund_window` | 604,800 | seconds |
| Verification Expiry | `set_verification_expiry` | 31,536,000 | seconds |

---

## Support & Debugging

For transaction details and explorer links:

```bash
# Get transaction details
sui client transaction <TX_DIGEST>

# View on Suiscan
# https://suiscan.xyz/testnet/tx/<TX_DIGEST>
```

---

*Quilvion Protocol — Configuration Management Guide v1.0*
